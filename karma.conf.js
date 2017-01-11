module.exports = function (config) {
  config.set({
    browsers: [ 'Firefox' ],

    frameworks: ['mocha'],

    singleRun: true,

    files: [
      'test/ui/ui_test.js',
      'public/js/bundle.js'
    ],

    reporters: ['dots'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO
  })
}
