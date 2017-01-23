import { Course, CLocation } from '../interfaces/app'
import * as Im from 'immutable'

export const COURSES: Course[] = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
].map(name => ({
  key: name,
  body: Im.List<CLocation>(require(`./route_${name.toLowerCase()}.json`))
}))

export default COURSES