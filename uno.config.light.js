import { defineConfig } from 'unocss'
import { presetWarp } from '@warp-ds/uno'

export default defineConfig({
  presets: [presetWarp()],
  // CLI configuration to include all preflight CSS files globally in Light DOM
  // {skipResets:true} If using a externaly handled reset.
  cli: {
    entry: [
      {
        patterns: ['index.html'],
        outFile: './dist/light.css', // generate one common bundle for Light DOM preflight styles
      },
    ]
  },

})