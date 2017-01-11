/**
 * Site Header
 */
import * as React from 'react'

class Header extends React.Component<{}, {}> {
  render () {
    return (
      <div className='header'>
        <h1><a href='index.html'>ドローン自動運転システム</a></h1>
      </div>
    )
  }
}

export default Header
