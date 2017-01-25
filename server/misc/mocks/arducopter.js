const { Module } = require('sugo-module-base')
const debug = require('debug')('hec:ardu:mock')

let mirror = (name, args) => {
  return {
    name,
    args
  }
}

/** @lends ArducopterModule */
class ArducopterModule extends Module {
  constructor (config = {}) {
    super(config)
    const s = this
  }

  arm (bool) {
    this.emit('armed', bool)
    debug('arm')
    return mirror('arm', bool)
  }

  takeoff (...args) {
    debug('takeoff')
    return mirror('takeoff', args)
  }

  connect (...args) {
    debug('connect')
    return mirror('connect', args)
  }

  disableEvents (...args) {
    debug('disableEvents')
    return mirror('disableEvents', args)
  }

  enableEvents (...args) {
    debug('enableEvents')
    return mirror('enableEvents', args)
  }

  setMode (mode) {
    debug('setMode')
    this.emit('mode', { mode })
    return mirror('setMode', mode)
  }

  saveMission (...args) {
    debug('saveMission')
    return mirror('saveMission', args)
  }

  startMission (...args) {
    debug('startMission')
    return mirror('startMission', args)
  }

  get $spec () {
    return {
      name: 'ArducopterModule',
      version: '1.0.0',
      desc: '',
      methods: {
        arm: {},
        takeoff: {},
        connect: {},
        disableEvents: {},
        enableEvents: {},
        setMode: {},
        saveMission: {},
        startMission: {},
      },

      events: {
        mode: {},
        armed: {},
        disarmed: {},
        position: {},
        missionSaved: {},
        commandReached: {},
      },
    }
  }
}

module.exports = ArducopterModule