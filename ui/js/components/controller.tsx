import * as React from 'react'
import * as Im from 'immutable'
import { ApForm } from 'apeman-react-form'
import { ApFieldSet, ApField, ApFieldLabel, ApFieldValue } from 'apeman-react-field'
import { ApText } from 'apeman-react-text'
import { ApButton } from 'apeman-react-button'
import { AppState } from './app'
import { connectCaller, startAutoFlight } from '../helpers/app_util'
import { Caller, Course } from '../interfaces/app'
import COURSES from '../src/courses'
const styles = require('../css/controller.css')


const C_KEYS = COURSES.map(c => c.key)

interface TextFormFieldProps {
  label: string
  value: string
  onChange: any
  completed: Boolean
}

class TextFormField extends React.Component<TextFormFieldProps, {}> {
  render() {
    let {label, value, onChange, completed} = this.props
    return (
      <ApField>
        <ApFieldLabel style={{ minWidth: '3em' }}>
          { label }
        </ApFieldLabel>
        <ApFieldValue>
          {completed
            ? <div className={ styles.plenText }>{ value }</div>
            : <ApText className={ styles.text }
                value={ value }
                onChange={onChange}
                rows={1}
              />
          }
        </ApFieldValue>
      </ApField>
    )
  }
}

interface Props {
  state: AppState
  setState: any
}

class Controller extends React.Component<Props, {}> {
  render () {
    const s = this
    let {
      selectedCourseKey,
      connected,
      droneType,
      droneAddr,
      droneKey,
      spinningConnection,
      spinningStartMission,
    } = s.props.state
    let isSelected = !!selectedCourseKey
    return (
      <div className={ styles.wrap }>
        <h3 className={ styles.title }>Drone接続</h3>
        <div className={styles.connectForm}>
          <ApForm id='connect-drone-form' spinning={ spinningConnection }>
            <TextFormField
              label='KEY'
              value={droneKey}
              onChange={s.setDroneKey.bind(s)}
              completed={ connected }
              />
            <TextFormField
              label='TYPE'
              value={droneType}
              onChange={s.setDroneType.bind(s)}
              completed={ connected }
              />
            <TextFormField
              label='ADDR'
              value={droneAddr}
              onChange={s.setDroneAddr.bind(s)}
              completed={ connected }
              />
            <ApButton
              wide
              disabled={connected}
              onTap={s.connectAndroid.bind(s)}
              >
              { connected ? '接続済み' : '接続' }
            </ApButton>
          </ApForm>
        </div>

        <h3 className={ styles.title }>コース選択</h3>
        <div className={ styles.courseButtons }>
          {C_KEYS.map(key =>
            <div key={key}>
              <ApButton
                primary={selectedCourseKey === key}
                wide
                onTap={s.showCourse(key)}
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
            onTap={s.startFly.bind(s)}
            spinning={spinningStartMission}
            style={{lineHeight: '2em'}}
            >
            飛行開始
          </ApButton>

        </div>

      </div>
    )
  }

  startFly () {
    const s = this
    if (!window.confirm('飛行開始しますか？')) {
      return
    }
    s.props.setState({
      spinningStartMission: true
    })
    let {callers, courses, selectedCourseKey, droneKey, droneType, droneAddr} = s.props.state
    let caller = callers.get(droneKey)
    let course = courses.find((course: Course) => course.key === selectedCourseKey)
    startAutoFlight(course, caller, droneType, droneAddr)
      .then(() => {
        s.props.setState({
          spinningStartMission: false
        })
        window.alert('自動飛行コマンドを送信しました。')
      })
      .catch((e) => {
        throw e
      })
  }

  connectAndroid () {
    const s = this
    let { droneKey } = s.props.state
    s.props.setState({
      spinningConnection: true
    })
    connectCaller(droneKey)
      .then((caller: Caller) => {
        s.props.setState({
          connected: true,
          spinningConnection: false,
          callers: s.props.state.callers.set(droneKey, caller)
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

  setDroneKey (e) {
    this.props.setState({ droneKey: e.target.value })
  }

  setDroneType (e) {
    this.props.setState({ droneType: e.target.value })
  }
  
  setDroneAddr (e) {
    this.props.setState({ droneAddr: e.target.value })
  }
}

export default Controller
