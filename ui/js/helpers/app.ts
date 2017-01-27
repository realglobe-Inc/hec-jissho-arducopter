/**
 * App hepler functions
 */
import * as Im from 'immutable'
import { CLocation } from '../interfaces/app'

/**
 * Mission ごとにほぼ一意に決まる数値
 * Drone 側で登録されている Mission がどのコースを把握するために使う
 */
export const calcMissionUniqueNum = (mission): number => {
  return mission.slice(2).reduce((num: number, { coordinate = [0, 0, 0]}) => num + Math.floor(coordinate[0] * 1000) + Math.floor(coordinate[1] * 1000), 0)
}