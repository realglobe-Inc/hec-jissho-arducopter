const { join } = require('path')
const { readdirSync } = require('fs')
const webpack = require('webpack')
const ClosureCompilerPlugin = require('webpack-closure-compiler')
const devConfig = require('./webpack.config.dev')
const CssConfig = devConfig[1]

const NODE_ENV = process.env.NODE_ENV || 'production'
const JS_ENTRY_PATH = 'ui/js/entries'
const PUBLIC_PATH = join(__dirname, 'server/public')

const JsConfig = () => {
  let entries = readdirSync(join(__dirname, JS_ENTRY_PATH))
    .map((file) => file.split('.')[0])

  return {
    entry: entries.reduce((obj, name) => {
      return Object.assign(obj, {
        [name]: [
          'babel-polyfill',
          join(__dirname, `ui/js/entries/${name}`)
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
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.RG_GOOGLE_API_KEY': JSON.stringify(process.env.RG_GOOGLE_API_KEY)
      }),
      new ClosureCompilerPlugin({
        compiler: {
          language_in: 'ECMASCRIPT6',
          language_out: 'ECMASCRIPT5',
          compilation_level: 'SIMPLE'
        },
        concurrency: 3,
      })
    ],
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
      ]
    },
    ts: {
      compilerOptions: {
        sourceMap: false
      }
    },
    resolve: {
      extensions: [ '', '.js', '.jsx', '.ts', '.tsx', '.json' ]
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-dom/server': 'ReactDOMServer',
      'react-redux': 'ReactRedux',
      'redux': 'Redux'
    }
  }
}

module.exports = [
  JsConfig(),
  CssConfig
]
