# Animated Popup Feature

## Overview
Added an animated popup card that displays detailed item information when users click on item names or images in the market table.

## Features

### 1. **Clickable Item Names**
- Item names in the table are now clickable buttons
- Hover effect shows blue glow and color change
- Clicking opens the animated info card

### 2. **Clickable Item Images**
- Item thumbnail images are now clickable
- Cursor changes to pointer on hover
- Clicking opens the same animated info card

### 3. **Animated Info Card**
The info card features:
- **Smooth entrance animation** - Scales and fades in
- **EVE Online-style design** - Dark sci-fi aesthetic
- **Neon glow effects** - Animated pulsing blue/purple glow
- **Glass morphism** - Blurred background with transparency
- **Quick actions** - Edit and Delete buttons right in the popup

### 4. **Info Card Contents**
Displays:
- Item image (large preview)
- Item name
- Category
- Quantity
- Timestamp
- All three notes
- Quick action buttons (Edit/Delete)

## User Interaction

### Opening the Popup
1. Click on any **item name** in the table
2. Click on any **item image** in the table

### Closing the Popup
1. Click the **X** button in the top-right corner
2. Click **outside** the popup card
3. Press **Edit** (opens edit modal)
4. After deleting an item

## Technical Details

### HTML Structure
```html
<div id="info-overlay" class="info-overlay">
    <div id="info-card" class="info-card">
        <button id="info-close">✕</button>
        <div class="info-header">
            <img id="info-image" />
            <div>
                <div id="info-title">Item name</div>
                <div id="info-meta">Category • Qty • time</div>
            </div>
        </div>
        <div id="info-notes">Notes</div>
        <div>
            <button id="info-edit">Edit</button>
            <button id="info-delete">Delete</button>
        </div>
    </div>
</div>
```

### JavaScript Functions
- `showInfoCard(item)` - Opens the popup with item data
- `closeInfoCard()` - Closes the popup
- Click handlers attached to:
  - `.name-link` buttons in table
  - `.table-image` images in table

### CSS Animations
- `neonPulse` - Pulsing glow effect (2.8s infinite)
- `neonShift` - Color shift animation (6s infinite)
- Transform transitions on `.info-card.enter`
- Backdrop blur for glass effect

### Styling
- Dark background overlay with 60% opacity
- Glassmorphism card with backdrop blur
- Animated neon glow border (blue/purple/pink)
- Smooth scale and opacity transitions
- Responsive max-width (92% on mobile)

## Browser Compatibility
- Modern browsers with CSS backdrop-filter support
- Fallback without backdrop-filter still functional
- Mobile responsive design

## Accessibility
- ARIA attributes for screen readers
- Focus management (focuses Edit button on open)
- Keyboard accessible (Tab navigation)
- Click outside to close

## Performance
- Smooth 60fps animations
- GPU-accelerated transforms
- Efficient event delegation
- No memory leaks (proper cleanup)
