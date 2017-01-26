/**
 * Application util functions
 */
import * as sugoCaller from 'sugo-caller'
import { Caller, Course, CLocation } from '../interfaces/app'

const debug = require('debug')('hec:app_util')

const WAIT_CONNECT = 2000

const DroneEvents = {
  MODE: 'mode',
  MISSION_SAVED: 'missionSaved',
  DISARMED: 'disarmed',
  COMMAND_REACHED: 'commandReached',
  BATTERY: 'battery',
  POSITION: 'position',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
}
const DroneMode = {
  GUIDED: 'GUIDED',
}
const DRONE_MODULE = 'arducopter'

const emptyCheck = (obj) => {
  for (let key of Object.keys(obj)) {
    if (!obj[key]) {
      throw new Error(`${key} is empty.`)
    }
  }
}

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
 * 飛行開始(Missonは設定済み)
 */
export const startAutoFlight = (caller: Caller, type: string, addr: string) => {
  return new Promise((resolve, reject) => {
    emptyCheck({ caller, type, addr })
    const {
      MODE,
    } = DroneEvents
    const {
      GUIDED
    } = DroneMode

    let arducopter = caller.get(DRONE_MODULE)
    if (!arducopter) {
      reject(Error(`Module not found '${DRONE_MODULE}'`))
    }

    // 2
    arducopter.once(MODE, ({ mode }) => {
      if (mode.toUpperCase() === GUIDED) {
        debug(MODE)
        arducopter.startMission(true, true)
          .then(resolve)
      }
    })

    // 1
    arducopter
      .connect(type, addr)
      .then(() => {
        // Wait for a while
        return new Promise((resolve) => {
          setTimeout(resolve, WAIT_CONNECT)
        })
      })
      .then(() => {
        return arducopter.enableEvents([
          MODE,
        ])
      })
      .then(() => {
        return arducopter.setMode(GUIDED)
      })
  })
}

/**
 * Drone に Mission を設定する
 */
export const saveMission = (course: Course, caller: Caller, type: string, addr: string) => {
  return new Promise((resolve, reject) => {
    emptyCheck({ course, caller, type, addr })
    const {
      MODE,
      MISSION_SAVED,
    } = DroneEvents
    const {
      GUIDED,
    } = DroneMode
    // Config
    const takeoffAlt = 10
    const maxAlt = 50

    let arducopter = caller.get(DRONE_MODULE)
    if (!arducopter) {
      reject(new Error(`Module not found '${DRONE_MODULE}'`))
      return
    }

    let timeoutId = setTimeout(() => reject(new Error('Timeout')), 10000)

    // 2
    arducopter.once(MODE, ({ mode }) => {
      if (mode.toUpperCase() === GUIDED) {
        debug(MODE)
        const mission = createMission(course, takeoffAlt, maxAlt)
        arducopter.saveMission(mission)
      }
    })

    // 3
    arducopter.once(MISSION_SAVED, () => {
      debug(MISSION_SAVED)
      clearTimeout(timeoutId)
      resolve()
    })

    // 1
    arducopter
      // 接続されている状態で何回 connect しても OK?
      .connect(type, addr)
      .then(() => {
        // Wait for connection
        return new Promise((resolve) => {
          setTimeout(resolve, WAIT_CONNECT)
        })
      })
      .then(() => {
        return arducopter.enableEvents([
          MODE,
          MISSION_SAVED,
        ])
      })
      .then(() => {
        return arducopter.setMode(GUIDED)
      })
  })
}

/**
 * Course から Mission に変換
 */
export const createMission = (course: Course, takeoffAlt: number, maxAlt: number) => {
  emptyCheck({ course })
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

/**
 * Drone の状態を取得し、イベントを監視する
 */
export const watchDroneState = (caller: Caller, callback, type: string, addr: string) => {
  emptyCheck({ caller, callback, type, addr })
  const {
    BATTERY,
    POSITION,
    CONNECTED,
    DISCONNECTED,
    COMMAND_REACHED,
    DISARMED,
  } = DroneEvents

  let arducopter = caller.get(DRONE_MODULE)
  if (!arducopter) {
    throw new Error(`Module not found '${DRONE_MODULE}'`)
  }

  arducopter.on(BATTERY, (battery) => callback({ battery }))
  arducopter.on(POSITION, (coordinate) => callback({ coordinate }))
  arducopter.on(CONNECTED, () => callback({ connected: true }))
  arducopter.on(DISCONNECTED, () => callback({ connected: false }))

  arducopter.on(COMMAND_REACHED, ({ index }) => {
    debug(COMMAND_REACHED, index)
  })
  arducopter.on(DISARMED, () => {
    debug(DISARMED)
  })


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
      return arducopter.disableEvents(null)
    })
    .then(() => {
      return arducopter.enableEvents([
        BATTERY,
        POSITION,
        CONNECTED,
        DISCONNECTED,
        COMMAND_REACHED,
        DISARMED,
      ])
    })
}
