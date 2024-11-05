import { defineConfig } from 'unocss'
import { presetWarp } from '@warp-ds/uno'

export default defineConfig({
  presets: [presetWarp({skipResets:true})],
  // CLI configuration to include all preflight CSS files globally in Light DOM
  // This is set up to handle additions to the regular resets (like fouc before mount trickery)
  cli: {
    entry: [
      {
        patterns: ['src/common/preflight.css','src/components/**/preflight.css'],
        outFile: './dist/preflights.css', // generate one common bundle for Light DOM preflight styles
      },
    ]
  },

})
