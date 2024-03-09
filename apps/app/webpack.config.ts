const NxWebpackPlugin = require('@nx/webpack').NxWebpackPlugin
const { join } = require('node:path')

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/app'),
  },
  devServer: {
    port: 4200,
  },
  plugins: [
    new NxWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: [
        './src/favicon.ico',
      ],
      styles: [
        './src/styles.css'
      ],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    })
  ]
}
