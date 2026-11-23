import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [react()],
    adapter: netlify({
        // Netlify's local Edge Functions runtime requires Deno. Keep Astro's
        // standalone dev server usable when that runtime is unavailable.
        devFeatures: { edgeFunctions: false }
    })
});
