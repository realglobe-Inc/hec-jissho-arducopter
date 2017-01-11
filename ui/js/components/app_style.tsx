/**
 * Style of the whole application.
 */
import * as React from 'react'
import { ApButtonStyle } from 'apeman-react-button'
import * as config from '@self/ui/config'

const { color } = config

class AppStyle extends React.Component<{}, {}> {
  render () {
    return (
      <div className='app_style'>
        <ApButtonStyle highlightColor={color} />
      </div>
    )
  }
}

export default AppStyle
