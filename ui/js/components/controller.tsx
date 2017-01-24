import * as React from 'react'
import * as Im from 'immutable'
import { ApButton } from 'apeman-react-button'
import { AppState } from './app'
import { connectCaller } from '../helpers/app_util'
import { Caller } from '../interfaces/app'
import COURSES from '../src/courses'
const styles = require('../css/controller.css')

interface Props {
  state: AppState
  setState: any
}

const ACTOR_KEY = 'arducopter:1'
const C_KEYS = COURSES.map(c => c.key)

class Controller extends React.Component<Props, {}> {
  render () {
    const s = this
    let { selectedCourseKey, connected } = s.props.state
    let isSelected = !!selectedCourseKey
    return (
      <div className={ styles.wrap }>
        <h3 className={ styles.title }>Android接続</h3>
        <div className={ styles.connectButton }>
          <ApButton
            wide
            disabled={connected}
            onTap={s.connectAndroid.bind(s)}
            >
            { connected ? '接続済み' : '接続' }
          </ApButton>
        </div>

        <h3 className={ styles.title }>コース選択</h3>
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

        <h3 className={ styles.title }>飛行</h3>
        <div className={ styles.startButton }>
          <div className={ connected ? styles.messageHide : styles.message }>
            Android接続してください
          </div>
          <div className={ isSelected ? styles.messageHide : styles.message }>
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

      </div>
    )
  }

  startFly () {
    if (!window.confirm('飛行開始しますか？')) {
      return
    }
    console.log('FLY')
  }

  connectAndroid () {
    const s = this
    connectCaller(ACTOR_KEY)
      .then((caller: Caller) => {
        s.props.setState({
          connected: true,
          callers: s.props.state.callers.set(ACTOR_KEY, caller)
        })
      })
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
