import { defineConfig, presetWind3 } from 'unocss';
export default defineConfig({
  // ...UnoCSS options
  theme: {
    fontFamily: {
      segoe: 'Segoe UI, Arial, sans-serif',
    },
  },
  presets: [presetWind3()],
});
