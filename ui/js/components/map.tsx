import * as React from 'react'
import GoogleMap from 'google-map-react'
import { AppState } from './app'

const mapStyle = require('../src/map_style.json')
const API_KEY = process.env.RG_GOOGLE_API_KEY

interface Props {
  state: AppState
  setState: any
}

class Map extends React.Component<Props, {}> {
  render () {
    const s = this
    return (
      <div className='map'>
        <GoogleMap center={{lat: 0, lng: 0}}
                   options={s.createOptions.bind(s)}
                   defaultZoom={17}
                   bootstrapURLKeys={{key: API_KEY}}
        >
          { s.renderMarkers() }
        </GoogleMap>
      </div>
    )
  }

  renderMarkers () {

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
