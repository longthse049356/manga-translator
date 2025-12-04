# Vibrant Glassmorphism Manga Translator UI

A premium, immersive manga translation tool with a stunning glassmorphism design inspired by modern creative workspaces.

## ✨ Features

### 🎨 **Design Language**
- **Aurora Mesh Gradient Background**: Dynamic, flowing gradients with purple, cyan, and pink accents
- **Glassmorphism Effects**: Frosted glass panels with backdrop blur and subtle borders
- **Vibrant Color Palette**: High-energy colors for buttons and accents
- **Smooth Animations**: Blob animations, hover effects, and transitions

### 🔧 **Core Functionality**
1. **Upload Mode**: 
   - Drag & drop image upload
   - MangaDex chapter URL import
   - Real-time image grid with status indicators
   - Batch translation with progress tracking

2. **Reader Mode**:
   - Gapless vertical scrolling for seamless reading
   - Three view modes:
     - **Translated**: Vietnamese version only
     - **Original**: English/Raw version only
     - **Compare**: Side-by-side comparison slider
   - Pinch-to-zoom support for mobile
   - Page counter and navigation

### 📦 **Component Architecture**

```
components/translate-tool/
├── gradient-background.tsx    # Aurora mesh gradient with animated blobs
├── reader-header.tsx          # Sticky glass header with mode switcher
├── upload-zone.tsx            # Glowing upload panel + MangaDex fetcher
├── image-grid.tsx             # Glass cards for uploaded images
├── reader-view.tsx            # Immersive reader with compare slider
├── index.ts                   # Barrel exports
├── ACCESSIBILITY.md           # WCAG compliance documentation
└── README.md                  # This file
```

## 🚀 **Getting Started**

### Prerequisites
All dependencies are already installed:
- `react-compare-slider` ✅
- `react-zoom-pan-pinch` ✅
- `lucide-react` ✅
- Shadcn UI components ✅

### Usage

The refactored page is located at:
```
app/(auth)/translate-tool/page.tsx
```

Simply run the development server:
```bash
pnpm dev
```

Then navigate to:
```
http://localhost:3000/translate-tool
```

## 🎯 **Key Components**

### 1. GradientBackground
Creates the vibrant animated background with Aurora UI effect.

**Features:**
- Deep indigo/purple gradient base
- Three animated blob gradients (purple, cyan, pink)
- Subtle grid overlay
- 7-second infinite animation loop

### 2. ReaderHeader
Floating glass header with mode switcher and controls.

**Features:**
- Sticky positioning with auto-hide on scroll
- Toggle between Upload/Reader modes
- "Translate All" button with progress indicator
- Settings icon button
- Gradient-powered active states

### 3. UploadZone
Glowing upload area with MangaDex integration.

**Features:**
- Drag & drop file upload
- MangaDex chapter URL fetcher
- Animated glow on hover
- Feature badges (Multiple files, Drag & drop, URL import)
- File validation (10MB max, .jpg/.png/.webp)

### 4. ImageGrid
Glass cards displaying uploaded images with status.

**Features:**
- Stats overview (Success/Processing/Failed)
- 3-column responsive grid
- Status indicators (Success ✅, Processing ⏳, Error ❌)
- Image preview with hover zoom
- Action buttons (Download, Retry, Remove)
- Progress bars for translating images

### 5. ReaderView
Immersive reading experience with compare mode.

**Features:**
- Three view modes (Translated/Original/Compare)
- Gapless vertical scrolling
- Compare slider for before/after
- Zoom toggle for mobile
- Page counter overlay
- Lazy loading for performance

## 🎨 **Design System**

### Colors

Based on UI/UX Pro Max search results:

**Primary Palette** (Creative Agency):
- Primary: `#EC4899` (Pink)
- Secondary: `#F472B6` (Light Pink)
- CTA: `#06B6D4` (Cyan)

**Gradients:**
- Aurora: Purple (#BF00FF) → Cyan (#00FFFF) → Pink (#FF1493)
- Buttons: Various gradient combinations

**Glass Panels:**
- Background: `bg-white/5` to `bg-white/10`
- Border: `border-white/20`
- Backdrop: `backdrop-blur-xl`

### Typography
- Font: Geist Sans (via Next.js)
- Headings: Bold, white with drop shadow
- Body: 14px minimum, cyan/white tones
- Helper text: 12px, white/50

### Spacing
- Container max-width: `max-w-4xl` (Upload), `max-w-3xl` (Reader)
- Section gaps: 1.5rem to 2rem
- Card padding: 1rem to 1.5rem

## ♿ **Accessibility**

All components meet **WCAG AA standards (4.5:1 contrast ratio)**.

See `ACCESSIBILITY.md` for detailed contrast verification.

**Key Features:**
- High contrast text on glass backgrounds
- Text shadows for enhanced legibility
- Icon + Text pairing for all actions
- Keyboard navigation support
- Focus visible indicators
- Screen reader friendly labels

## 🔧 **Customization**

### Changing Colors

Edit `gradient-background.tsx`:
```tsx
// Change blob colors
bg-purple-500/30  // → bg-blue-500/30
bg-cyan-500/30    // → bg-green-500/30
bg-pink-500/30    // → bg-orange-500/30
```

### Adjusting Glass Opacity

Edit individual components:
```tsx
bg-white/10  // → bg-white/15 (more opaque)
bg-white/5   // → bg-white/3 (more transparent)
```

### Animation Speed

Edit `globals.css`:
```css
.animate-blob {
  animation: blob 7s infinite; /* Change 7s to desired speed */
}
```

## 📱 **Responsive Design**

- **Mobile** (< 640px): Single column, optimized touch targets
- **Tablet** (640px - 1024px): 2-column grid, compact header
- **Desktop** (> 1024px): 3-column grid, full features

## 🚨 **Known Limitations**

1. **Performance**: Heavy backdrop-blur may lag on low-end devices
2. **Browser Support**: Requires modern browser with backdrop-filter support
3. **Animations**: Reduced motion users should see `prefers-reduced-motion` respected

## 🎉 **What's New**

Compared to the old UI:

| Old | New |
|-----|-----|
| Basic white background | Aurora gradient background |
| Simple cards | Glassmorphism with blur |
| No mode switcher | Upload/Reader mode toggle |
| Basic image list | Responsive grid with glass cards |
| No compare feature | Compare slider integration |
| No zoom | Pinch-to-zoom support |
| Static layout | Animated blobs and transitions |

## 📚 **References**

- UI/UX Pro Max: Glassmorphism style guidelines
- Shadcn UI: Component library
- React Compare Slider: Image comparison
- React Zoom Pan Pinch: Touch gestures

## 🙏 **Credits**

- **Design Inspiration**: Modern coworking spaces, creative tools
- **UI Framework**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **AI Design Intelligence**: UI/UX Pro Max skill

---

Built with ❤️ using Next.js 16, TypeScript, and Tailwind CSS

