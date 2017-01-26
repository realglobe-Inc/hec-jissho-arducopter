import * as React from 'react'
import * as autoBind from 'react-autobind'
import GoogleMap from 'google-map-react'
import { AppState } from './app'
import { Course } from '../interfaces/app'
import COURSES from '../src/courses'

const styles = require('../css/map.css')
const mapStyle = require('../src/map_style.json')
const API_KEY = process.env.RG_GOOGLE_API_KEY

class Pin extends React.Component<any, {}> {
  render() {
    return (
      <div className={ styles.pin }>
        <i className={ 'fa fa-2x fa-map-pin' } aria-hidden />
      </div>
    )
  }
}

class Drone extends React.Component<any, {}> {
  render() {
    return (
      <div className={ styles.pin }>
        <i className={ 'fa fa-2x fa-long-arrow-down' } aria-hidden />
      </div>
    )
  }
}

interface Props {
  app: {
    state: AppState
    setState: any
  }
}

class Map extends React.Component<Props, {}> {
  constructor() {
    super()
    autoBind(this)
  }

  mapObj: any
  polyObj: any

  render() {
    const s = this
    const { app } = s.props
    let { mapCenter } = app.state
    return (
      <div className={ styles.wrap }>
        <GoogleMap center={ mapCenter }
          options={ s.createOptions }
          defaultZoom={ 19 }
          bootstrapURLKeys={ { key: API_KEY } }
          onChange={ s.changeCenter }
          onGoogleApiLoaded={ ({map}) => s.mapObj = map }
          yesIWantToUseGoogleMapApiInternals={ true }
          >
          { s.renderDrone() }
          { s.renderMarkers() }
        </GoogleMap>
      </div>
    )
  }

  changeCenter({ center }) {
    this.props.app.setState({ mapCenter: center })
  }

  renderMarkers() {
    const s = this
    const { app } = s.props
    let { selectedCourseKey } = app.state
    if (!selectedCourseKey) {
      return null
    }
    let course = COURSES.find(c => c.key === selectedCourseKey)
    s.drawLines(course)
    return course.body.toArray().map(({ordinal, lat, lng, height}) =>
      <Pin key={ ordinal } lat={ lat } lng={ lng } height={ height } />
    )
  }

  renderDrone() {
    const s = this
    const { app } = s.props
    let {statusConnected, statusPosition} = app.state
    let {lat, lng} = statusPosition
    if (statusConnected && lat > 0 && lng > 0) {
      return <Drone lat={ lat } lng={ lng } />
    } else {
      return null
    }
  }

  createOptions() {
    return {
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER
      },
      styles: mapStyle['MAP_NOMAL_MODE']
    }
  }

  drawLines(course: Course) {
    const s = this
    // 以前の線を消す
    if (s.polyObj) {
      s.polyObj.setMap(null)
    }
    let points = course.body.toArray().map((({lat, lng}) => new google.maps.LatLng(lat, lng)))
    let polyLineOptions = {
      path: points,
      strokeWeight: 2,
      strokeColor: "#eb4ca2",
      strokeOpacity: "0.5"
    }
    s.polyObj = new google.maps.Polyline(polyLineOptions)
    s.polyObj.setMap(s.mapObj)
  }
}

export default Map
