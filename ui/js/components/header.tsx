/**
 * Site Header
 */
import * as React from 'react'
const styles = require('../css/header.css')

export default class Header extends React.Component<{}, {}> {
  render() {
    return (
      <div className={ styles.wrap }>
        <h1 className={ styles.title }>
          <a className={ styles.titleLink } href='index.html'>ドローン自動運転システム</a>
        </h1>
      </div>
    )
  }
}
