import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Header from '../components/header'
import auth from '../helpers/auth'

const rootElement = document.getElementById('site')

document.addEventListener('DOMContentLoaded', () => {
  if (!auth(window.prompt, window.localStorage)) {
    return
  }
  ReactDOM.render(
    <div className='app'>
      <Header/>
      <div className='app-body'>
        Hello
      </div>
    </div>,
    rootElement
  )
})
