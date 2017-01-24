/**
 * Application util functions
 */
import * as sugoCaller from 'sugo-caller'
import { Caller } from '../interfaces/app'
const debug = require('debug')('hec:app_util')

export const connectCaller = (key: string) => {
  return sugoCaller({
    protocol: window.location.protocol,
    host: window.location.host,
    path: '/arducopter/sugos/arducopter/socket.io'
  }).connect(key)
}
