#!/usr/bin/env node
/**
 * Arducopter actor のモック
 */
const Actor = require('sugo-actor')
const co = require('co')
const url = require('url')
const ArducopterModule = require('@self/server/misc/mocks/arducopter')

const {
  KEY = 'arducopter:1'
} = process.env

function connectArducopterActor(port) {
  return co(function* () {
    let actor = Actor({
      key: KEY,
      protocol: 'http',
      host: `localhost:${port}`,
      modules: {
        ArduCopter: new ArducopterModule({})
      },
      path: '/arducopter/sugos/arducopter/socket.io'
    })
    yield actor.connect()
  })
}

module.exports = connectArducopterActor