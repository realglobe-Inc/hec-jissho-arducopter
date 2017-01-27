/**
 * Helper functions about Drone
 */
import * as sugoCaller from 'sugo-caller'
import { Caller, Course, CLocation } from '../interfaces/app'
import * as assert from 'assert'

const debug = require('debug')('hec:helpers:drone')

const WAIT_CONNECT = 5000

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
const DRONE_MODULE = 'ArduCopter'

/**
 * 指定した Actor Key の Caller 接続する
 */
export const connectCaller = (key: string): Promise<Caller> => {
  return sugoCaller({
    protocol: window.location.protocol,
    host: window.location.host,
    path: '/arducopter/sugos/arducopter/socket.io'
  }).connect(key)
}

/**
 * まだ接続されていなければドローンと接続する
 */
export const connectDrone = (arducopter, type: string, addr: string): Promise<{}> => {
  return Promise.resolve()
    .then(() => {
      return arducopter.isConnected()
    })
    .then((isConnected: Boolean) => {
      if (isConnected) {
        return
      }
      return arducopter
        .connect(type, addr)
        .then(() => {
          // Wait for connection
          return new Promise((resolve) => {
            setTimeout(resolve, WAIT_CONNECT)
          })
        })
    })
}

/**
 * ドローンを GUIDE Mode にする
 */
export const setGuideMode = (arducopter): Promise<{}> => {
  const { MODE } = DroneEvents
  const { GUIDED } = DroneMode
  let isGuideMode = (mode) => mode.toUpperCase() === GUIDED
  return Promise.resolve()
    .then(() => {
      return arducopter.getMode()
    })
    .then(({ mode }) => {
      if (isGuideMode(mode)) {
        return
      }
      return new Promise((resolve) => {
        arducopter.once(MODE, ({ mode }) => {
          debug(MODE, mode)
          if (isGuideMode(mode)) {
            resolve()
          }
        })
        arducopter.setMode(GUIDED)
      })
    })
}

/**
 * 飛行開始(Missonは設定済み)
 */
export const startAutoFlight = (caller: Caller, type: string, addr: string): Promise<{}> => {
  return new Promise((resolve, reject) => {
    assert.ok(caller)
    assert.ok(type)
    assert.ok(addr)
    const {
      MODE,
    } = DroneEvents
    const {
      GUIDED
    } = DroneMode
    let arducopter = caller.get(DRONE_MODULE)
    if (!arducopter) {
      reject(Error(`Module not found '${ DRONE_MODULE }'`))
      return
    }
    let timeoutId = setTimeout(() => reject(new Error('Timeout')), WAIT_CONNECT + 5000)

    Promise.resolve()
      .then(() => {
        return connectDrone(arducopter, type, addr)
      })
      .then(() => {
        return arducopter.getMission()
      })
      .then(({ commands }) => {
        assert.ok(commands.length > 0)
        return arducopter.enableEvents([
          MODE,
        ])
      })
      .then(() => {
        return setGuideMode(arducopter)
      })
      .then(() => {
        return arducopter.startMission(true, true)
      })
      .then(() => {
        clearTimeout(timeoutId)
        resolve()
      })
      .catch((e) => {
        clearTimeout(timeoutId)
        reject(e)
      })
  })
}

/**
 * Drone に Mission を設定する
 */
export const saveMission = (course: Course, caller: Caller, type: string, addr: string): Promise<{}> => {
  return new Promise((resolve, reject) => {
    assert.ok(caller)
    assert.ok(type)
    assert.ok(addr)
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
    const mission = createMission(course, takeoffAlt, maxAlt)

    let arducopter = caller.get(DRONE_MODULE)
    if (!arducopter) {
      reject(new Error(`Module not found '${ DRONE_MODULE }'`))
      return
    }
    let timeoutId = setTimeout(() => reject(new Error('Timeout')), WAIT_CONNECT + 5000)

    Promise.resolve()
      .then(() => {
        return connectDrone(arducopter, type, addr)
      })
      .then(() => {
        return arducopter.enableEvents([
          MODE,
          MISSION_SAVED,
        ])
      })
      .then(() => {
        return setGuideMode(arducopter)
      })
      .then(() => {
        arducopter.once(MISSION_SAVED, () => {
          debug(MISSION_SAVED)
          clearTimeout(timeoutId)
          resolve()
        })
        return arducopter.saveMission(mission)
      })
      .catch((e) => {
        clearTimeout(timeoutId)
        reject(e)
      })
  })
}

/**
 * Course から Mission に変換
 */
export const createMission = (course: Course, takeoffAlt: number, maxAlt: number) => {
  assert.ok(course)
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
    coordinate: [loc.lat, loc.lng, loc.height]
  }))
  let last = [{
    type: 'land'
  }]
  let mission = [].concat(takeoff, main, last)
  return mission
}

/**
 * Drone の状態を取得し、イベントを監視する
 */
export const watchDroneState = (caller: Caller, notify, type: string, addr: string): Promise<{}> => {
  assert.ok(caller)
  assert.ok(notify)
  assert.ok(type)
  assert.ok(addr)
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
    throw new Error(`Module not found '${ DRONE_MODULE }'`)
  }

  arducopter.on(BATTERY, (battery) => notify({ battery }))
  arducopter.on(POSITION, ({ coordinate }) => notify({ coordinate }))
  arducopter.on(CONNECTED, () => notify({ connected: true }))
  arducopter.on(DISCONNECTED, () => notify({ connected: false }))

  arducopter.on(COMMAND_REACHED, ({ index }) => {
    debug(COMMAND_REACHED, index)
  })
  arducopter.on(DISARMED, () => {
    debug(DISARMED)
  })

  return Promise.resolve()
    .then(() => {
      return connectDrone(arducopter, type, addr)
    })
    .then(() => {
      notify({ connected: true })
      return arducopter.getBattery()
    })
    .then((battery) => {
      notify({ battery })
      return arducopter.getPosition()
    })
    .then(({ coordinate }) => {
      notify({ coordinate })
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

