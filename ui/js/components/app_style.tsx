/**
 * Style of the whole application.
 */
import * as React from 'react'
import { ApButtonStyle } from 'apeman-react-button'
import { ApTextStyle } from 'apeman-react-text'
import { ApFieldStyle } from 'apeman-react-field'
import { ApFormStyle } from 'apeman-react-form'
import { ApSpinnerStyle } from 'apeman-react-spinner'

const COLOR = '#343469'

class AppStyle extends React.Component<{}, {}> {
  render() {
    return (
      <div className='app_style'>
        <ApButtonStyle highlightColor={ COLOR } />
        <ApTextStyle highlightColor={ COLOR } />
        <ApFieldStyle highlightColor={ COLOR } />
        <ApFormStyle highlightColor={ COLOR } />
        <ApSpinnerStyle highlightColor={ COLOR } />
      </div>
    )
  }
}

export default AppStyle
