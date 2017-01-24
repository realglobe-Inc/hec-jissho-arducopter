import * as Im from 'immutable'

/**
 * 地図上の緯度経度
 */
export interface Location {
  lat: number
  lng: number
}

/**
 * コースの要素
 */
export interface CLocation {
  lat: number
  lng: number
  height: number
  ordinal: number
}

/**
 * ドローンのコース
 */
export interface Course {
  key: string
  body: Im.List<CLocation>
}

/**
 * SUGO-Caller のインスタンス
 */
export interface Caller {
  get(key: string): any
}