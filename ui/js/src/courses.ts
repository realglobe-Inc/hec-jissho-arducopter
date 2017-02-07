import { Course, CLocation } from '../interfaces/app'
import * as Im from 'immutable'
import { calcMissionUniqueNum } from '../helpers/app'
import { createMission } from '../helpers/drone'

export const COURSES: Course[] = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
  'TEST_RG',
  'TEST_F1',
  'TEST_F2',
  'TEST_F3',
].map(name => ({
  key: name,
  body: Im.List<CLocation>(require(`./route_${ name.toLowerCase() }.json`))
})).map((course: Course) => ({
  key: course.key,
  body: course.body,
  uniqueNumber: calcMissionUniqueNum(createMission(course, 0, 0))
}))

export default COURSES