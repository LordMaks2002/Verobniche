import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: 'Personal Planner PWA',
        short_name: 'PlannerPWA',
        description: 'A personal planner Progressive Web App',
        theme_color: '#ffffff',
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        navigateFallback: 'index.html',
        type: 'module',
      },
    }),
  ],
});
