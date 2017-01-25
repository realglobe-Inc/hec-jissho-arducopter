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

  connect () {
    debug('connect')
    this.emit('connected', 1)
    return mirror('connect', 1)
  }

  disconnect() {
    debug('disconnect')
    this.emit('disconnected', 1)
    return mirror('disconnect', 1)
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

  getPosition () {
    debug('getPosition')
    return [33.596624, 130.214451, 0]
  }

  getBattery() {
    debug('getBattery')
    return {
      remain: '100%',
      voltage: '10V',
      current: '5A',
    }
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
        disconnect: {},
        disableEvents: {},
        enableEvents: {},
        setMode: {},
        saveMission: {},
        startMission: {},
        getPosition: {},
        getBattery: {},
      },

      events: {
        connected: {},
        disconnected: {},
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