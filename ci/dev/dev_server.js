#!/usr/bin/env node
/**
 * Dev server of webpack
 */

const DevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require('../../webpack.config.dev')
const promisify = require('es6-promisify')
const { port } = require('@self/server/env')

const compiler = webpack(config)
const HOST = process.env.HOST || 'localhost'

let devServer = new DevServer(compiler, {
  // contentBase: `http://${HOST}/`,
  hot: true,
  historyApiFallback: false,
  compress: false,
  proxy: {
    '/arducopter/': {
      target: `http://${HOST}:${port.UI}`,
      pathRewrite: { '^/arducopter': '' }
    }
  },
  staticOptions: {},

  // webpack-dev-middleware options
  quiet: false,
  noInfo: true,
  publicPath: '/arducopter/',
  stats: { colors: true }
})

// promisify listen
let listen = devServer.listen.bind(devServer)
devServer.listen = promisify(listen)

if (!module.parent) {
  devServer.listen(port.DEV)
}

module.exports = devServer
