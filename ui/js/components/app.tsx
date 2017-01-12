import * as React from 'react'
import Header from '../components/header'
import Controller from '../components/controller'
import Map from '../components/map'
import { Course, CLocation } from '../interfaces/app'
import * as Im from 'immutable'

const courses = [{
  key: 'A1',
  body: Im.List<CLocation>(require('../src/route_a1.json'))
}, {
  key: 'A2',
  body: Im.List<CLocation>(require('../src/route_a2.json'))
}]


export interface AppState {
  courses: Course[]
  resisteredCourseId?: number
}

class App extends React.Component<{}, AppState> {
  constructor () {
    super()
    this.state = {
      courses: [],
    }
  }
  render () {
    const s = this
    let { state } = s
    return (
      <div className='app'>
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
