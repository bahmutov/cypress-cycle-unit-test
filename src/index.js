/// <reference types="Cypress" />

import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

function setXMLHttpRequest (w) {
  // by grabbing the XMLHttpRequest from app's iframe
  // and putting it here - in the test iframe
  // we suddenly get spying and stubbing 😁
  window.XMLHttpRequest = w.XMLHttpRequest
  return w
}

function setAlert (w) {
  window.alert = w.alert
  return w
}

// mounts given view "main" function in the test runner
export const mount = (main, drivers = {}) => {
  cy
    .window()
    .then(setXMLHttpRequest)
    .then(setAlert)
    .then(win => {
      const domDrivers = drivers.DOM
        ? { DOM: drivers.DOM }
        : {
          DOM: makeDOMDriver(win.document.body)
        }
      const allDrivers = Object.assign({}, domDrivers, drivers)
      run(main, allDrivers)
    })
}
