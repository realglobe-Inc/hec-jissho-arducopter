import * as sha1 from 'sha1'

export default function auth (prompt, localStorage) {
  if (process.env.NODE_ENV !== 'production') {
    return true
  }
  var storageKey = 'quick-auth'
  if (localStorage.getItem(storageKey) === 'ok') {
    return true
  }
  var password = prompt('Password?')
  var ok = sha1(String(password).trim()) === '7cf376588bab612485fc1a908175cbb69afc2d17'
  if (ok) {
    localStorage.setItem(storageKey, 'ok')
    return true
  } else {
    console.error('Login failed')
    document.write('<p><h3>Auth failed.</h3></p>')
    return false
  }
}
