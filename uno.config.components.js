import { defineConfig } from 'unocss'
import { presetWarp } from '@warp-ds/uno'

export default defineConfig({
  presets: [presetWarp({ skipResets:true} )],
  cli: {
    entry: [
      {
        patterns: ['src/components/my-panel/my-panel.js'],
        outFile: './dist/my-panel.css',
      },
      {
        patterns: ['src/components/my-card/my-card.js'],
        outFile: './dist/my-card.css',
      }
    ]
  },

})
