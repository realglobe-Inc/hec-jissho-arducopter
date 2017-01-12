import * as Im from 'immutable'

export interface Location {
  lat: number
  lng: number
}

export interface HLocation {
  lat: number
  lng: number
  height: number
}

export interface Course {
  id: number
  name: string
  body: Im.List<HLocation>
}

