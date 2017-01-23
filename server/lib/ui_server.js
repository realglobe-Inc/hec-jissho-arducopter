/**
 * SUGO-Hub Server to manage UI
 */
const sugoHub = require('sugo-hub')
const env = require('@self/server/env')
const { join } = require('path')

let isTest = process.env.NODE_ENV === 'test'

let config = {
  public: [
    join(__dirname, '../public')
  ],
  storage: isTest ? null : {
    redis: {
      url: env.redis.URL,
      db: 7
    }
  },
  socketIoOptions: {
    path: '/sugos/arducopter/socket.io'
  },
  logFile: join(__dirname, '../../var/log/ui_server.log')
}

const uiServer = sugoHub(config)

module.exports = uiServer
