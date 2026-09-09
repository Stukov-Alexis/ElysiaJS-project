import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import { staticPlugin } from '@elysiajs/static'
import { createClient } from '@supabase/supabase-js'
import { readFile, unlink, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

interface Item {
  id: string
  name: string
  quantity: number
  note1: string
  note2: string
  note3: string
  image: string
  category?: string
  timestamp: string
}

let items: Item[] = []
const DB_FILE = 'database.json'
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'item-images'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Load database
if (!supabase && existsSync(DB_FILE)) {
  const data = await Bun.file(DB_FILE).text()
  items = JSON.parse(data)
}

// Save database
async function saveDatabase() {
  await writeFile(DB_FILE, JSON.stringify(items, null, 2))
}

async function getItems() {
  if (!supabase) return items

  const { data, error } = await supabase.from('items').select('*').order('timestamp', { ascending: false })
  if (error) throw error
  return data as Item[]
}

function fileName(file: File) {
  const extension = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, '')
  return `${crypto.randomUUID()}${extension}`
}

async function uploadImage(file: File) {
  if (!supabase) {
    const name = `${Date.now()}-${file.name}`
    await writeFile(path.join('uploads', name), Buffer.from(await file.arrayBuffer()))
    return `/uploads/${name}`
  }

  const objectName = fileName(file)
  const { error } = await supabase.storage.from(storageBucket).upload(objectName, await file.arrayBuffer(), {
    contentType: file.type || 'application/octet-stream',
    upsert: false
  })
  if (error) throw error
  return supabase.storage.from(storageBucket).getPublicUrl(objectName).data.publicUrl
}

async function removeImage(imageUrl: string) {
  if (!imageUrl) return
  if (!supabase) {
    const imagePath = imageUrl.replace('/uploads/', 'uploads/')
    if (existsSync(imagePath)) await unlink(imagePath)
    return
  }

  const marker = `/storage/v1/object/public/${storageBucket}/`
  const objectName = imageUrl.includes(marker) ? imageUrl.split(marker)[1] : ''
  if (objectName) await supabase.storage.from(storageBucket).remove([objectName])
}

async function serveFile(filePath: string, contentType: string) {
  return new Response(await readFile(filePath), { headers: { 'content-type': contentType } })
}

const app = new Elysia({ adapter: node() })
  .use(staticPlugin({
    assets: 'uploads',
    prefix: '/uploads'
  }))
  .use(staticPlugin({
    assets: 'backgrounds',
    prefix: '/backgrounds'
  }))
  .get('/styles.css', () => serveFile('public/styles.css', 'text/css'))
  .get('/', () => serveFile('public/index.html', 'text/html'))
  
  // Get all items
  .get('/api/items', () => getItems())
  
  // Add new item
  .post('/api/items', async ({ body }) => {
    const formData = body as any
    
    // Handle image upload
    let imagePath = ''
    if (formData.image && formData.image instanceof File) {
      imagePath = await uploadImage(formData.image as File)
    }
    
    const newItem: Item = {
      id: Date.now().toString(),
      name: formData.name || '',
      quantity: parseInt(formData.quantity) || 0,
      note1: formData.note1 || '',
      note2: formData.note2 || '',
      note3: formData.note3 || '',
      category: formData.category || 'Uncategorized',
      image: imagePath,
      timestamp: new Date().toISOString()
    }
    
    if (supabase) {
      const { error } = await supabase.from('items').insert(newItem)
      if (error) throw error
    } else {
      items.push(newItem)
      await saveDatabase()
    }
    
    return { success: true, item: newItem }
  })
  
  // Delete item
  .delete('/api/items/:id', async ({ params: { id } }) => {
    const currentItems = await getItems()
    const item = currentItems.find(value => value.id === id)
    if (!item) {
      return { success: false, error: 'Item not found' }
    }

    await removeImage(item.image)
    if (supabase) {
      const { error } = await supabase.from('items').delete().eq('id', id)
      if (error) throw error
    } else {
      items = currentItems.filter(value => value.id !== id)
      await saveDatabase()
    }
    
    return { success: true }
  })
  
  // Update item
  .put('/api/items/:id', async ({ params: { id }, body }) => {
    const formData = body as any
    const currentItems = await getItems()
    const itemIndex = currentItems.findIndex(item => item.id === id)
    if (itemIndex === -1) {
      return { success: false, error: 'Item not found' }
    }
    const item = currentItems[itemIndex]!
    
    // Handle new image upload
    let imagePath = item.image
    if (formData.image && formData.image instanceof File) {
      await removeImage(item.image)
      imagePath = await uploadImage(formData.image as File)
    }

    const updatedItem = {
      ...item,
      name: formData.name || item.name,
      quantity: parseInt(formData.quantity) || item.quantity,
      note1: formData.note1 || item.note1,
      note2: formData.note2 || item.note2,
      note3: formData.note3 || item.note3,
      category: formData.category || item.category,
      image: imagePath
    }
    if (supabase) {
      const { error } = await supabase.from('items').update(updatedItem).eq('id', id)
      if (error) throw error
    } else {
      items[itemIndex] = updatedItem
      await saveDatabase()
    }

    return { success: true, item: updatedItem }
  })

export default app.fetch

if (import.meta.main) {
  app.listen(3000)
  console.log('Database server is running at http://localhost:3000')
}
