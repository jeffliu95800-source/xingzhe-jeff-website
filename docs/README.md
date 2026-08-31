# Personal Portfolio — Rogier de Boevé Style

A minimalist, dark-themed personal portfolio inspired by [rogierdeboeve.com](https://rogierdeboeve.com/).

## Design Features

- **Dark theme** with subtle noise texture
- **24-column grid system** for precise layouts
- **Smooth animations** with staggered reveals
- **Monospace accents** for labels and metadata
- **Dashed borders** and pixel-perfect details
- **Typography-focused** with large headings
- **Marquee text** for visual interest
- **Responsive design** for all devices

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **CSS3** with custom properties
- **Space Grotesk** + **Space Mono** fonts

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── page.css        # Home styles
│   ├── globals.css     # Global styles
│   └── about/
│       ├── page.tsx    # About page
│       └── page.css    # About styles
└── public/
    └── favicon.svg     # Site favicon
```

## Customization

### 1. Update Content

Edit the data arrays in `page.tsx`:
- `projects` - Your books and projects
- `skills` - Your capabilities
- `timeline` - Your history

### 2. Update Colors

Edit CSS variables in `globals.css`:
```css
:root {
  --color-bg: #0a0a0a;
  --color-text: #fafafa;
  --color-text-muted: #666666;
}
```

### 3. Update Fonts

Change font imports in `globals.css` and update `--font-sans` / `--font-mono`.

## Pages

- **/** - Home with project index
- **/about** - About page with skills and timeline

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## Credits

Design inspired by [Rogier de Boevé](https://rogierdeboeve.com/).

## License

MIT
