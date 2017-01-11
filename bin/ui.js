#!/usr/bin/env node
const co = require('co')
const { port } = require('@self/server/env')
const uiServer = require('@self/server/lib/ui_server')

co(function * () {
  yield uiServer.listen(port.UI)
  console.log(`UI server listening on port ${port.UI}`)
}).catch(err => console.error(err))

