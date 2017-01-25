/**
 * Application util functions
 */
import * as sugoCaller from 'sugo-caller'
import { Caller, Course, CLocation } from '../interfaces/app'

const debug = require('debug')('hec:app_util')

const WAIT_CONNECT = 2000

/**
 * 指定した Actor Key の Caller 接続する
 */
export const connectCaller = (key: string) => {
  return sugoCaller({
    protocol: window.location.protocol,
    host: window.location.host,
    path: '/arducopter/sugos/arducopter/socket.io'
  }).connect(key)
}

/**
 * ミッションを登録して飛行開始
 */
export const startAutoFlight = (course: Course, caller: Caller, type: string, addr: string) => {
  // Events
  const MODE = 'mode'
  const MISSION_SAVED = 'missionSaved'
  const DISARMED = 'disarmed'
  const COMMAND_REACHED = 'commandReached'
  // Config
  const takeoffAlt = 10
  const maxAlt = 50
  // Mode
  const GUIDED = 'GUIDED'

  const name = 'arducopter'
  let arducopter = caller.get(name)
  if (!arducopter) {
    throw new Error(`Module not found '${name}'`)
  }

  // 2
  arducopter.on(MODE, data => {
    if (data.mode.toUpperCase() === GUIDED) {
      debug(MODE)
      const mission = createMission(course, takeoffAlt, maxAlt)
      arducopter.saveMission(mission)
    }
  })

  // 3
  arducopter.on(MISSION_SAVED, () => {
    debug(MISSION_SAVED)
    arducopter.startMission(true, true)
    arducopter.on(DISARMED, () => {
      debug(DISARMED)
    })
  })

  arducopter.on(COMMAND_REACHED, data => {
    debug(COMMAND_REACHED, data.index)
  })

  // 1
  return arducopter
    .connect(type, addr)
    .then(() => {
      // Wait for a while
      return new Promise((resolve) => {
        setTimeout(resolve, WAIT_CONNECT)
      })
    })
    .then(() => {
      return arducopter.disableEvents(null)
    })
    .then(() => {
      return arducopter.enableEvents([
        MODE,
        MISSION_SAVED,
        DISARMED,
        COMMAND_REACHED,
      ])
    })
    .then(() => {
      return arducopter.setMode(GUIDED)
    })
}

/**
 * Course から Mission に変換
 */
export const createMission = (course: Course, takeoffAlt: number, maxAlt: number) => {
  let takeoff = [
    {
      type: 'takeoff',
      altitude: takeoffAlt
    },
    { // 上昇
      type: 'waypoint',
      coordinate: [0, 0, maxAlt]
    }
  ]
  let main = course.body.toArray().map((loc: CLocation) => ({
    type: 'waypoint',
    coodinate: [loc.lat, loc.lng, loc.height]
  }))
  let mission = [].concat(takeoff, main)
  return mission
}

export const watchDroneState = (caller: Caller, callback, type: string, addr: string) => {
  // Events
  const BATTERY = 'battery'
  const POSITION = 'position'
  const CONNECTED = 'connected'
  const DISCONNECTED = 'disconnected'

  const name = 'arducopter'
  let arducopter = caller.get(name)
  if (!arducopter) {
    throw new Error(`Module not found '${name}'`)
  }

  arducopter.on(BATTERY, (battery) => callback({ battery }))
  arducopter.on(POSITION, (coordinate) => callback({ coordinate }))
  arducopter.on(CONNECTED, () => callback({ connected: true }))
  arducopter.on(DISCONNECTED, () => callback({ connected: false }))

  return arducopter
    .connect(type, addr)
    .then(() => {
      callback({ connected: true })
      // Wait for a while
      return new Promise((resolve) => {
        setTimeout(resolve, WAIT_CONNECT)
      })
    })
    .then(() => {
      return arducopter.getBattery()
    })
    .then((battery) => {
      callback({ battery })
    })
    .then(() => {
      return arducopter.getPosition()
    })
    .then((coordinate) => {
      callback({ coordinate })
    })
    .then(() => {
      return arducopter.enableEvents([
        BATTERY,
        POSITION,
        CONNECTED,
        DISCONNECTED,
      ])
    })
}
