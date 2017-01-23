import * as React from 'react'
import AppStyle from './app_style'
import Header from './header'
import Controller from './controller'
import Map from './map'
import { Course, CLocation, Location } from '../interfaces/app'
import * as Im from 'immutable'
import COURSES from '../src/courses'

const MAP_CENTER = {
  lat: 33.596984,
  lng: 130.227675,
}

export interface AppState {
  courses: Course[]
  selectedCourseKey?: string
  mapCenter: Location
}

class App extends React.Component<{}, AppState> {
  constructor () {
    super()
    this.state = {
      courses: COURSES,
      mapCenter: MAP_CENTER
    }
  }
  render () {
    const s = this
    let { state } = s
    return (
      <div className='app'>
        <AppStyle/>
        <Header/>
        <div className='app-body'>
          <Controller state={state} setState={s.setState.bind(s)} />
          <Map state={state} setState={s.setState.bind(s)} />
        </div>
      </div>
    )
  }
}


export default App
