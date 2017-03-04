/* @flow */
import React from 'react'
import { render } from 'react-dom'
import Index from './index'
if (module.hot) {
  module.hot.accept()
}
render(<Index />, document.querySelector('#app'))
