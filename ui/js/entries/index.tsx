import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from '../components/app'
import auth from '../helpers/auth'

const rootElement = document.getElementById('site')

document.addEventListener('DOMContentLoaded', () => {
  if (!auth(window.prompt, window.localStorage)) {
    return
  }
  ReactDOM.render(
    <App />,
    rootElement
  )
})
