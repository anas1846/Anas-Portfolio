# Muhammad Anas — Portfolio

Built from the "Obsidian" concept: black glossy 3D loops behind graphite glass panels.

**Stack:** React 18 + Vite, React Three Fiber (three.js) for the 3D loops, GSAP + ScrollTrigger for animation, Lenis for smooth scroll, Poppins (self-hosted via Fontsource).

## Run

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # outputs /dist
    npm run preview

## Where to edit

- **All text, project cards, FAQ, links, email/WhatsApp:** `src/data.js`
- **Section markup:** `src/components/` (Hero, Work, Sections)
- **3D loops (shape, colour, motion):** `src/components/Scene.jsx`
- **Colours, spacing, fonts:** `src/style.css` (variables at the top)
- **Project screenshots:** `public/images/` (keep names, or change paths in `src/data.js`)

## Deploy

**Set your live address so link previews work** (WhatsApp / LinkedIn need an absolute image URL):

    SITE_URL=https://your-domain.com npm run build

On Netlify or Vercel add `SITE_URL` as an environment variable. This adds the canonical link, `og:url` and the preview image (`public/og.png`).

Vercel / Netlify: import the repo, build command `npm run build`, output `dist`.
Or drag the `dist` folder onto app.netlify.com/drop.

## Notes

- Respects `prefers-reduced-motion` (no smooth scroll, no loop spin, no reveals).
- If WebGL is unavailable the page falls back to a plain graphite background; nothing else breaks.
- Three.js loads in a separate chunk after the page paints.
