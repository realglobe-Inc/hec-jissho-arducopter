/**
 * Modal window of confirmation
 */
import * as React from 'react'
import * as c from 'classnames'
import { ApButton } from 'apeman-react-button'
const styles = require('../css/confirm_modal.css')

interface Props {
  message: string
  yes?: string
  no?: string
  onYes: any
  onNo: any
  visible: Boolean
  enterYes?: Boolean
}

export default class ConfirmModal extends React.Component<Props, {}> {
  render() {
    const s = this
    let {
      message,
      yes = 'YES',
      no = 'NO',
      onYes,
      onNo,
      visible,
      enterYes,
    } = s.props
    return (
      <div className={ c(styles.bg, visible ? '' : styles.hidden) }>
        <div className={ styles.window }>
          <div className={ styles.message }>
            { message }
          </div>
          <div className={ styles.buttons }>
            <ApButton onTap={ enterYes ? s.yes.bind(s) : onYes }>{ yes }</ApButton>
            <ApButton onTap={ onNo }>{ no }</ApButton>
          </div>
        </div>
      </div>
    )
  }

  componentDidUpdate(prevProps: Props) {
    const s = this
    if (!s.props.enterYes) {
      return
    }
    if (!prevProps.visible && s.props.visible) {
      document.addEventListener('keydown', s.detectEnter.bind(s))
    }
  }

  detectEnter(e) {
    const ENTER = 13
    if (e.keyCode === ENTER) {
      this.yes()
    }
  }

  yes() {
    const s = this
    document.removeEventListener('keydown', s.detectEnter)
    s.props.onYes()
  }
}

