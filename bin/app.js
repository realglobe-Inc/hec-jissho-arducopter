#!/usr/bin/env node

const { port } = require('@self/server/env')
const ui = require('@self/server/lib/ui_server')
const co = require('co')
const debug = require('debug')('hec:app')

function app () {
  return co(function * () {
    // UI
    yield ui.listen(port.UI)
    debug(`UI server listening on port ${port.UI}`)
  }).catch((err) => console.error(err))
}

module.exports = app

if (!module.parent) {
  app()
}
