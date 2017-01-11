const { readdirSync } = require('fs')
const { join } = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const jsonImporter = require('node-sass-json-importer')
const { port } = require('./server/env')

const JS_ENTRY_PATH = 'ui/js/entries'
const CSS_ENTRY_PATH = 'ui/scss'
const PUBLIC_PATH = join(__dirname, 'server/public')

const JsConfig = () => {
  let entries = readdirSync(join(__dirname, JS_ENTRY_PATH))
    .filter((file) => file.match(/\.tsx$/))
    .map((file) => file.split('.')[0])

  return {
    entry: entries.reduce((obj, name) => {
      return Object.assign(obj, {
        [name]: [
          `webpack-dev-server/client?http://localhost:${port.DEV}/`,
          'webpack/hot/dev-server',
          'babel-polyfill',
          join(__dirname, JS_ENTRY_PATH, name)
        ]
      })
    }, {}),
    output: {
      path: join(PUBLIC_PATH, 'js'),
      filename: '[name].bundle.js',
      publicPath: '/js/'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.RG_GOOGLE_API_KEY': JSON.stringify(process.env.RG_GOOGLE_API_KEY)
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ],
      preLoaders: [
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '', '.js', '.jsx', '.ts', '.tsx', '.json' ]
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-redux': 'ReactRedux',
      'redux': 'Redux'
    }
  }
}

const CssConfig = () => {
  let entries = readdirSync(join(__dirname, CSS_ENTRY_PATH))
    .filter((file) => file.match(/\.scss$/))
    .map((file) => file.split('.')[0])

  return {
    entry: entries.reduce((obj, name) => {
      return Object.assign(obj, {
        [name]: join(__dirname, `ui/scss/${name}.scss`)
      })
    }, {}),
    output: {
      path: join(PUBLIC_PATH, 'css'),
      filename: '[name].css',
      publicPath: '/css/'
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style-loader', [ 'css-loader', 'postcss-loader', 'sass-loader' ])
        }
      ]
    },
    sassLoader: {
      importer: jsonImporter
    },
    postcss () {
      return [ autoprefixer ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ]
  }
}

module.exports = [
  JsConfig(),
  CssConfig()
]
