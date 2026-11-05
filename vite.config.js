import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Link previews (WhatsApp, LinkedIn) need absolute URLs, so these tags are added only when the
// live address is known:  SITE_URL=https://your-domain.com npm run build
// On Netlify / Vercel, set SITE_URL as an environment variable instead.
const siteTags = () => ({
  name: 'site-tags',
  transformIndexHtml(html) {
    const site = (process.env.SITE_URL || '').replace(/\/$/, '');
    const tags = site
      ? [
          `<link rel="canonical" href="${site}/" />`,
          `<meta property="og:url" content="${site}/" />`,
          `<meta property="og:image" content="${site}/og.png" />`,
          `<meta name="twitter:image" content="${site}/og.png" />`,
        ].join('\n    ')
      : '';
    return html.replace('<!--SITE_TAGS-->', tags);
  },
});

export default defineConfig({
  plugins: [react(), siteTags()],
  base: '/Anas-Portfolio/',
});