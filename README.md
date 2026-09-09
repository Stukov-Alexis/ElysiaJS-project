# funny-project

An item database management system with image upload functionality built with ElysiaJS.

## Features

- 📦 Add, edit, and delete items
- 🖼️ Image upload and storage
- 📋 Multiple note fields per item
- 🔢 Quantity tracking
- 🗃️ Timestamp for each item
- 💾 Data persistence with JSON database
- 🎨 Modern, responsive card-based UI
- ✨ Smooth animations and transitions

## Getting Started

### Install dependencies
```bash
bun install
```

### Run the server
```bash
bun run index.ts
```

The database server will start at `http://localhost:3000`

### Development mode
```bash
bun --watch index.ts
```

This will start the server in watch mode and automatically restart on file changes.

## How to Use

1. Open `http://localhost:3000` in your browser
2. Click "+ Add Item" button
3. Fill in the item details:
   - Upload an image (optional)
   - Enter item name (required)
   - Set quantity (required)
   - Add up to 3 notes (optional)
4. Click "Save" to add the item
5. Use "Edit" or "Delete" buttons on item cards to manage items

## Supabase and Vercel deployment

The app uses Supabase Postgres for item records and the `item-images` Storage bucket for uploaded images. Without Supabase environment variables, local development falls back to `database.json` and `uploads/`.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env` and set `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY`.
4. Run locally with `bun run index.ts`.
5. Import the repository into Vercel and add the same environment variables for the Production environment.

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code. The Vercel function uses it only on the server.

## API Endpoints

- `GET /api/items` - Get all items
- `POST /api/items` - Add new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Technical Stack

- **Backend**: ElysiaJS with REST API
- **Frontend**: Vanilla JavaScript
- **Runtime**: Bun
- **Database**: Supabase Postgres with local JSON fallback
- **File Upload**: Supabase Storage with local filesystem fallback
- **Deployment**: Vercel Node function
- **Styling**: Modern CSS with gradients and animations


## Current issue
- Only display ".jpg" image