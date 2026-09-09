# Animation Test Guide

## What Changed

### 1. **Zoom Animation (2 seconds)**
- Card starts at 30% scale (very small)
- Zooms to 105% (slightly overshoots) at 1 second
- Settles to 100% at 2 seconds
- Creates a bounce/elastic effect

### 2. **Easing Function**
- `cubic-bezier(0.34, 1.56, 0.64, 1)` - Creates elastic bounce
- Makes the zoom feel more dynamic and game-like

### 3. **Background Fade**
- Overlay fades from transparent to 80% opacity
- Takes 0.5 seconds (faster than card zoom)

## How to Test

1. **Start the server:**
   ```bash
   bun run index.ts
   ```

2. **Open in browser:**
   ```
   http://localhost:3000
   ```

3. **Test the animation:**
   - Click on any **item name** in the table
   - Click on any **item image** in the table
   - Watch the card zoom in over 2 seconds

## Expected Behavior

### Opening Animation (2 seconds total):
- **0.0s** - Card invisible, very small (30% scale)
- **0.5s** - Card growing, background darkening
- **1.0s** - Card overshoots slightly (105% scale) - BOUNCE POINT
- **1.5s** - Card settling back
- **2.0s** - Card at final size (100% scale), fully visible

### Visual Effects:
- ✨ Neon glow pulses around the card
- 🌈 Multi-color gradient shifts
- 💨 Glassmorphism backdrop blur
- 🎯 Smooth elastic bounce

## Closing Animation:
- Click X button or outside = instant close
- (Could add exit animation later if needed)

## Animation Keyframes

```css
@keyframes zoomIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);  /* Overshoot! */
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
```

## Troubleshooting

If animation doesn't work:

1. **Hard refresh** browser (Ctrl+Shift+R)
2. **Clear cache** and reload
3. **Check console** for JavaScript errors
4. **Verify** `info-card.enter` class is being added

## Browser Support
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (with prefixes)
- ❌ IE11 (not supported)
