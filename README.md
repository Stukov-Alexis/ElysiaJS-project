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

## Connect Supabase and Vercel

The deployed app stores item records in Supabase Postgres and uploaded images in Supabase Storage. Local development uses the same Supabase project when the variables below are present; otherwise it falls back to `database.json` and `uploads/`.

### 1. Prepare the existing Supabase project

1. Open the Supabase dashboard and select your existing project.
2. Open **SQL Editor**, create a query, paste the contents of `supabase/schema.sql`, and click **Run**.
3. Open **Project Settings > API**.
4. Copy **Project URL** into `SUPABASE_URL`. It must look like `https://your-project-ref.supabase.co`, not a dashboard URL.
5. Copy the server-only `service_role` key into `SUPABASE_SERVICE_ROLE_KEY`.

The SQL creates the `items` table and the public `item-images` Storage bucket. The service-role key is required because the server uploads and deletes files. Never put it in frontend code or commit it to Git.

### 2. Connect local development

Copy `.env.example` to `.env` and replace the placeholder values:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` and run:

```powershell
bun install
bun run index.ts
```

Open `http://localhost:3000`. Confirm that `GET http://localhost:3000/api/items` returns the rows from Supabase. Stop the server before changing environment variables, then start it again.

### 3. Deploy the existing project to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New > Project**, import the repository, and choose the repository root as the project root.
3. In **Settings > Environment Variables**, add these variables for **Production**, **Preview**, and **Development**:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET` with value `item-images`
4. Deploy or redeploy the project.
5. Test `https://your-vercel-domain.vercel.app/` and `https://your-vercel-domain.vercel.app/api/items`.

The `api/index.ts` function serves the Elysia API, while `vercel.json` routes the existing HTML, CSS, and background assets. Do not add `SUPABASE_SERVICE_ROLE_KEY` to Vercel client-side code or `public/` files.

### Vercel error: "WebStandard does not support listen"

If Vercel shows this error, redeploy the latest version of the repository. Vercel imports `api/index.ts`, which exports `app.fetch`; it must not start a local server with `app.listen()`. The project now skips `app.listen()` whenever Vercel sets `VERCEL=1`, while `bun run index.ts` continues to start the local server on port `3000`.

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