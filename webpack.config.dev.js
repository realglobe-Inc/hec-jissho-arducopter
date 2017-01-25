const { readdirSync } = require('fs')
const { join } = require('path')
const webpack = require('webpack')
const { port } = require('./server/env')

const JS_ENTRY_PATH = 'ui/js/entries'
const PUBLIC_PATH = join(__dirname, 'server/public')

let entries = readdirSync(join(__dirname, JS_ENTRY_PATH))
  .filter((file) => file.match(/\.tsx$/))
  .map((file) => file.split('.')[0])

module.exports = {
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
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader?sourceMap',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ]
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
    extensions: [ '', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-redux': 'ReactRedux',
    'redux': 'Redux'
  }
}

