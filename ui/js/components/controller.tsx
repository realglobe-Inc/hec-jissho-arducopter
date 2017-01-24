import * as React from 'react'
import { ApButton } from 'apeman-react-button'
import { AppState } from './app'
import COURSES from '../src/courses'
const styles = require('../css/controller.css')

interface Props {
  state: AppState
  setState: any
}

class Controller extends React.Component<Props, {}> {
  render () {
    const s = this
    let keys = COURSES.map(c => c.key)
    return (
      <div className={ styles.wrap }>
        <h2>コース選択</h2>
        <div className='controller-buttons'>
          {keys.map(key =>
            <div className='controller-button-wrap'>
              <ApButton wide onTap={s.showCourse(key)} key={key}>コース{key}</ApButton>
            </div>
          )}
        </div>
      </div>
    )
  }

  showCourse (key: string) {
    const s = this
    return () => {
      let course = COURSES.find(c => c.key === key)
      let mapCenter = {
        lat: course.body.get(0).lat,
        lng: course.body.get(0).lng
      }
      s.props.setState({
        selectedCourseKey: key,
        mapCenter
      })
    }
  }
}

export default Controller
