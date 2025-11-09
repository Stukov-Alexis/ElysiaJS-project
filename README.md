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

## Data Storage

- Items are saved in `database.json` file
- Images are stored in the `uploads/` directory
- All data persists across server restarts

## API Endpoints

- `GET /api/items` - Get all items
- `POST /api/items` - Add new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Technical Stack

- **Backend**: ElysiaJS with REST API
- **Frontend**: Vanilla JavaScript
- **Runtime**: Bun
- **Database**: JSON file storage
- **File Upload**: Multipart form data
- **Styling**: Modern CSS with gradients and animations
