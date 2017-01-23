import * as React from 'react'
import GoogleMap from 'google-map-react'
import { AppState } from './app'
import COURSES from '../src/courses'

const mapStyle = require('../src/map_style.json')
const API_KEY = process.env.RG_GOOGLE_API_KEY

interface Props {
  state: AppState
  setState: any
}

class Marker extends React.Component<any, {}> {
  render () {
    return (
      <div>
        ●
      </div>
    )
  }
}

class Map extends React.Component<Props, {}> {
  render () {
    const s = this
    let { mapCenter } = s.props.state
    return (
      <div className='map'>
        <GoogleMap center={mapCenter}
                   options={s.createOptions.bind(s)}
                   defaultZoom={19}
                   bootstrapURLKeys={{key: API_KEY}}
                   onChange={s.changeCenter.bind(s)}
        >
          { s.renderMarkers() }
        </GoogleMap>
      </div>
    )
  }

  changeCenter ({ center }) {
    this.props.setState({ mapCenter:  center})
  }

  renderMarkers () {
    const s = this
    let { selectedCourseKey } = s.props.state
    if (!selectedCourseKey) {
      return null
    }
    let course = COURSES.find(c => c.key === selectedCourseKey)
    return course.body.toArray().map(({ordinal, lat, lng, height}) => 
      <Marker key={ordinal} lat={lat} lng={lng} height={height} />
    )
  }

  createOptions () {
    return {
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER
      },
      styles: mapStyle['MAP_NOMAL_MODE']
    }
  }
}

export default Map
