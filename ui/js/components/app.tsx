import * as React from 'react'
import AppStyle from './app_style'
import Header from './header'
import Controller from './controller'
import Map from './map'
import { Course, CLocation, Location, Caller } from '../interfaces/app'
import * as Im from 'immutable'
import COURSES from '../src/courses'
const styles = require('../css/app.css')

const MAP_CENTER = {
  lat: 33.596984,
  lng: 130.227675,
}

export interface AppState {
  courses: Course[]
  selectedCourseKey?: string
  mapCenter: Location
  connected: Boolean
  callers: Im.Map<string, Caller>
  droneType: string
  droneAddr: string
  droneKey: string
}

class App extends React.Component<{}, AppState> {
  constructor () {
    super()
    this.state = {
      courses: COURSES,
      mapCenter: MAP_CENTER,
      connected: false,
      callers: Im.Map<string, Caller>(),
      droneType: 'usb',
      droneAddr: '57600',
      droneKey: 'arducopter:1',
    }
  }
  render () {
    const s = this
    let { state } = s
    return (
      <div className='app'>
        <AppStyle/>
        <Header/>
        <div className={ styles.main }>
          <Controller state={state} setState={s.setState.bind(s)} />
          <Map state={state} setState={s.setState.bind(s)} />
        </div>
      </div>
    )
  }
}


export default App
