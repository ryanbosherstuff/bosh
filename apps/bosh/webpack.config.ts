import { NxWebpackPlugin } from '@nx/webpack'
import { join } from 'node:path'

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/bosh'),
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
        './src/assets'
      ],
      styles: [
        './src/styles.css'
      ],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    })
  ]
}
