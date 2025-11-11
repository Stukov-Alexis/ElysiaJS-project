import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { readdir, writeFile, unlink } from 'fs/promises'
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

// Load database
if (existsSync(DB_FILE)) {
  const data = await Bun.file(DB_FILE).text()
  items = JSON.parse(data)
}

// Save database
async function saveDatabase() {
  await writeFile(DB_FILE, JSON.stringify(items, null, 2))
}

const app = new Elysia()
  .use(staticPlugin({
    assets: 'uploads',
    prefix: '/uploads'
  }))
  .get('/styles.css', () => Bun.file('public/styles.css'))
  .get('/', () => Bun.file('public/index.html'))
  
  // Get all items
  .get('/api/items', () => items)
  
  // Add new item
  .post('/api/items', async ({ body }) => {
    const formData = body as any
    
    // Handle image upload
    let imagePath = ''
    if (formData.image && formData.image instanceof File) {
      const image = formData.image as File
      const imageId = Date.now() + '-' + image.name
      const uploadPath = path.join('uploads', imageId)
      
      await writeFile(uploadPath, Buffer.from(await image.arrayBuffer()))
      imagePath = '/uploads/' + imageId
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
    
    items.push(newItem)
    await saveDatabase()
    
    return { success: true, item: newItem }
  })
  
  // Delete item
  .delete('/api/items/:id', async ({ params: { id } }) => {
    const itemIndex = items.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return { success: false, error: 'Item not found' }
    }
    
  const item = items[itemIndex]!
    
    // Delete image file if exists
    if (item.image) {
      const imagePath = item.image.replace('/uploads/', 'uploads/')
      if (existsSync(imagePath)) {
        await unlink(imagePath)
      }
    }
    
    items.splice(itemIndex, 1)
    await saveDatabase()
    
    return { success: true }
  })
  
  // Update item
  .put('/api/items/:id', async ({ params: { id }, body }) => {
    const formData = body as any
    const itemIndex = items.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return { success: false, error: 'Item not found' }
    }
    
  const item = items[itemIndex]!
    
    // Handle new image upload
    let imagePath = item.image
    if (formData.image && formData.image instanceof File) {
      // Delete old image
      if (item.image) {
        const oldImagePath = item.image.replace('/uploads/', 'uploads/')
        if (existsSync(oldImagePath)) {
          await unlink(oldImagePath)
        }
      }
      
      // Save new image
      const image = formData.image as File
      const imageId = Date.now() + '-' + image.name
      const uploadPath = path.join('uploads', imageId)
      
      await writeFile(uploadPath, Buffer.from(await image.arrayBuffer()))
      imagePath = '/uploads/' + imageId
    }
    
    items[itemIndex] = {
      ...item,
      name: formData.name || item.name,
      quantity: parseInt(formData.quantity) || item.quantity,
      note1: formData.note1 || item.note1,
      note2: formData.note2 || item.note2,
      note3: formData.note3 || item.note3,
      category: formData.category || item.category,
      image: imagePath
    }
    
    await saveDatabase()
    
    return { success: true, item: items[itemIndex] }
  })
  
  .listen(3000)

console.log(`📋 Database server is running at http://${app.server?.hostname}:${app.server?.port}`)
