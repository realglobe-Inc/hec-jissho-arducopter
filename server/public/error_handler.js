(function () {
  // エラーアラートは一度のみ
  var throwed = false

  var handleError = function () {
    if (!throwed) {
      throwed = true
      window.alert('予期せぬエラーが発生しました:')
    }
  }

  window.addEventListener('error', handleError)

  // addEventListener できなかった
  var onUnhandled = window.onunhandledrejection
  window.onunhandledrejection = function (rejection) {
    onUnhandled && onUnhandled(rejection)
    console.error(rejection.reason)

    handleError()
  }
})()
