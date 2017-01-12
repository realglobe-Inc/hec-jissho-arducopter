import * as React from 'react'
import { ApButton } from 'apeman-react-button'
import { AppState } from './app'

interface Props {
  state: AppState
  setState: any
}

class Controller extends React.Component<Props, {}> {
  render () {
    const s = this
    return (
      <div className='controller'>
        <h2>コース選択</h2>
        <div className='controller-buttons'>
          <ApButton onTap={s.showCourse(1)}>コース1</ApButton>
          <ApButton onTap={s.showCourse(2)}>コース2</ApButton>
          <ApButton onTap={s.showCourse(3)}>コース3</ApButton>
        </div>
      </div>
    )
  }

  showCourse (id: number) {
    return () => {
      console.log(id)
    }
  }
}

export default Controller
