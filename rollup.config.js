export default {
  input: 'lib/dist/index.js',
  output: [
    {
      file: 'dist/vue-router-preview.cjs.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/vue-router-preview.esm.js',
      format: 'es'
    }
  ],
  plugins: [require('rollup-plugin-terser').terser()]
}
