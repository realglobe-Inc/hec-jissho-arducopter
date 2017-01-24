import * as React from 'react'
import { ApButton } from 'apeman-react-button'
import { AppState } from './app'
import COURSES from '../src/courses'
const styles = require('../css/controller.css')

interface Props {
  state: AppState
  setState: any
}

const C_KEYS = COURSES.map(c => c.key)

class Controller extends React.Component<Props, {}> {
  render () {
    const s = this
    let { selectedCourseKey } = s.props.state
    let isSelected = !!selectedCourseKey
    return (
      <div className={ styles.wrap }>
        <div className={ styles.startButton }>
          <div className={ isSelected ? styles.hidden : styles.message }>
            コースを選択してください
          </div>
          <ApButton
            wide
            disabled={ !isSelected }
            onTap={ s.startFly.bind(s) }
            >
            飛行開始
          </ApButton>

        </div>

        <h2 className={ styles.title } >コース選択</h2>
        <div className={ styles.courseButtons }>
          {C_KEYS.map(key =>
            <div>
              <ApButton
                primary={selectedCourseKey === key}
                wide
                onTap={s.showCourse(key)}
                key={key}
                >
                コース{key}
              </ApButton>
            </div>
          )}
        </div>
      </div>
    )
  }

  startFly () {
    if (!window.confirm('飛行開始しますか？')) {
      return
    }
    console.log('FLY')
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
