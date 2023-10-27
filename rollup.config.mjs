import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

const bundleName = 'resizeWatcher'
const name = 'ResizeWatcher'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/${bundleName}.iife.js`,
      format: 'iife',
      name
    },
    {
      file: `dist/${bundleName}.iife.min.js`,
      format: 'iife',
      name,
      plugins: [terser()]
    },
    {
      file: `dist/${bundleName}.esm.js`,
      format: 'es'
    },
    {
      file: `dist/${bundleName}.esm.min.js`,
      format: 'es',
      plugins: [terser()]
    }
  ],
  plugins: [typescript(), resolve()]
}
