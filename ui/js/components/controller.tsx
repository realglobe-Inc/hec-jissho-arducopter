import * as React from 'react'
import * as Im from 'immutable'
import * as autoBind from 'react-autobind'
import { ApForm } from 'apeman-react-form'
import { ApFieldSet, ApField, ApFieldLabel, ApFieldValue } from 'apeman-react-field'
import { ApText } from 'apeman-react-text'
import { ApButton } from 'apeman-react-button'
import { AppState } from './app'
import { connectCaller, startAutoFlight, saveMission, watchDroneState } from '../helpers/drone'
import { Caller, Course } from '../interfaces/app'
import ConfirmModal from './confirm_modal'
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
  constructor() {
    super()
    autoBind(this)
  }

  render() {
    let {label, value, onChange, completed} = this.props
    return (
      <ApField>
        <ApFieldLabel style={ { minWidth: '3em' } }>
          { label }
        </ApFieldLabel>
        <ApFieldValue>
          { completed
            ? <div className={ styles.plenText }>{ value }</div>
            : <ApText className={ styles.text }
              value={ value }
              onChange={ onChange }
              rows={ 1 }
              />
          }
        </ApFieldValue>
      </ApField>
    )
  }
}

interface Props {
  app: {
    state: AppState
    setState: any
  }
}

class Controller extends React.Component<Props, {}> {
  constructor() {
    super()
    autoBind(this)
  }

  render() {
    const s = this
    const { app } = s.props
    let {
      selectedCourseKey,
      savedCourseKey,
      connected,
      droneType,
      droneAddr,
      droneKey,
      spinningConnection,
      spinningSaveMission,
      spinningStartMission,
      statusBattery,
      statusPosition,
      statusConnected,
      modalForFlying,
    } = app.state
    let isSelected = !!selectedCourseKey
    return (
      <div className={ styles.wrap }>
        <h3 className={ styles.title }>Android 接続</h3>
        <div className={ styles.connectForm }>
          <ApForm id='connect-drone-form' spinning={ spinningConnection }>
            <TextFormField
              label='KEY'
              value={ droneKey }
              onChange={ s.setDroneKey }
              completed={ connected }
              />
            <TextFormField
              label='TYPE'
              value={ droneType }
              onChange={ s.setDroneType }
              completed={ connected }
              />
            <TextFormField
              label='ADDR'
              value={ droneAddr }
              onChange={ s.setDroneAddr }
              completed={ connected }
              />
            <ApButton
              wide
              disabled={ connected }
              onTap={ s.connectAndroid }
              >
              { connected ? '接続済み' : '接続' }
            </ApButton>
          </ApForm>
        </div>

        <h3 className={ styles.title }>Drone 状態</h3>
        <div>
          <ApField>
            <ApFieldLabel>
              状態
            </ApFieldLabel>
            <ApFieldValue>
              { statusConnected ? '接続' : '切断' }
            </ApFieldValue>
          </ApField>
          <ApField>
            <ApFieldLabel>
              残量
            </ApFieldLabel>
            <ApFieldValue>
              { statusBattery.remain }
            </ApFieldValue>
          </ApField>
          <ApField>
            <ApFieldLabel>
              電圧
            </ApFieldLabel>
            <ApFieldValue>
              { statusBattery.voltage }
            </ApFieldValue>
          </ApField>
          <ApField>
            <ApFieldLabel>
              電流
            </ApFieldLabel>
            <ApFieldValue>
              { statusBattery.current }
            </ApFieldValue>
          </ApField>
          <div className={ styles.center }>
            <ApButton
              disabled={ statusPosition.lat === 0 || statusPosition.lng === 0 }
              wide
              onTap={ s.moveMapToDrone }
              >初期位置表示</ApButton>
          </div>
        </div>

        <h3 className={ styles.title }>コース選択</h3>
        <div className={ styles.courseButtons }>
          { C_KEYS.map(key =>
            <div key={ key }>
              <ApButton
                primary={ selectedCourseKey === key }
                wide
                onTap={ s.showCourse(key) }
                >
                コース{ key }
              </ApButton>
            </div>
          ) }
          <div>
            <ApButton
              wide
              spinning={ spinningSaveMission }
              disabled={ !connected || !selectedCourseKey || !!savedCourseKey }
              onTap={ s.saveCourse }
              style={ { borderWidth: '2px', lineHeight: '1.8em' } }
              >
              { !!savedCourseKey ? 'コース保存済み' : 'コース決定' }
            </ApButton>
          </div>
        </div>

        <h3 className={ styles.title }>飛行</h3>
        <div className={ styles.startButton }>
          <div className={ connected ? styles.messageHide : styles.message }>
            UI と Android を接続してください
          </div>
          <div className={ isSelected ? styles.messageHide : styles.message }>
            コースを選択してください
          </div>
          <ApButton
            wide
            disabled={ !savedCourseKey || !connected }
            onTap={ () => { app.setState({ modalForFlying: true }) } }
            spinning={ spinningStartMission }
            style={ { borderWidth: '2px', lineHeight: '2em' } }
            >
            飛行開始
          </ApButton>
        </div>
        <ConfirmModal
          message='飛行開始しますか？'
          yes='はい'
          no='いいえ'
          onYes={ s.startFlying }
          onNo={ () => { app.setState({ modalForFlying: false }) } }
          visible={ modalForFlying }
          enterYes={ true }
          />
      </div>
    )
  }

  saveCourse() {
    const s = this
    const { app } = s.props
    app.setState({
      spinningSaveMission: true
    })
    let {callers, courses, selectedCourseKey, droneKey, droneType, droneAddr} = app.state
    let caller = callers.get(droneKey)
    let course = courses.find((course: Course) => course.key === selectedCourseKey)
    saveMission(course, caller, droneType, droneAddr)
      .then(() => {
        app.setState({
          savedCourseKey: selectedCourseKey,
        })
      })
      .catch((e) => {
        window.alert('コース保存に失敗しました')
        console.error(e)
      })
      .then(() => {
        app.setState({
          spinningSaveMission: false,
        })
      })
  }

  startFlying() {
    const s = this
    const { app } = s.props
    app.setState({
      spinningStartMission: true,
      modalForFlying: false,
    })
    let {callers, droneKey, droneType, droneAddr} = app.state
    let caller = callers.get(droneKey)
    startAutoFlight(caller, droneType, droneAddr)
      .catch((e) => {
        window.alert('コマンド送信に失敗しました。')
        console.error(e)
      })
      .then(() => {
        app.setState({
          spinningStartMission: false
        })
      })
  }

  connectAndroid() {
    const s = this
    const { app } = s.props
    let { callers, droneKey, droneAddr, droneType } = app.state
    app.setState({
      spinningConnection: true
    })
    Promise.resolve()
      .then(() => {
        let caller = callers.get(droneKey, null)
        if (caller) {
          return caller
        } else {
          return connectCaller(droneKey)
        }
      })
      .then((caller: Caller) => {
        app.setState({
          connected: true,
          callers: callers.set(droneKey, caller)
        })
        return caller
      })
      .then((caller: Caller) => {
        return watchDroneState(caller, s.updateDroneInfo, droneType, droneAddr)
      })
      .then(() => {
        app.setState({
          spinningConnection: false,
        })
      })
      .catch(e => {
        window.alert('Actorとの接続に失敗しました。')
        console.error(e)
        app.setState({
          spinningConnection: false,
          connected: false
        })
      })
  }

  updateDroneInfo(data) {
    const s = this
    const { app } = s.props
    let {
      battery,
      coordinate,
      connected,
    } = data
    if (battery) {
      app.setState({
        statusBattery: battery
      })
    }
    if (coordinate) {
      app.setState({
        statusPosition: {
          lat: Number(coordinate[0]),
          lng: Number(coordinate[1]),
        }
      })
    }
    if (connected) {
      app.setState({
        statusConnected: connected
      })
    }
  }

  moveMapToDrone() {
    const s = this
    const { app } = s.props
    app.setState({
      mapCenter: app.state.statusPosition
    })
  }

  showCourse(key: string) {
    const s = this
    const { app } = s.props
    return () => {
      let course = COURSES.find(c => c.key === key)
      let mapCenter = {
        lat: course.body.get(0).lat,
        lng: course.body.get(0).lng
      }
      app.setState({
        selectedCourseKey: key,
        mapCenter
      })
    }
  }

  setDroneKey(e) {
    this.props.app.setState({ droneKey: e.target.value })
  }

  setDroneType(e) {
    this.props.app.setState({ droneType: e.target.value })
  }

  setDroneAddr(e) {
    this.props.app.setState({ droneAddr: e.target.value })
  }
}

export default Controller
