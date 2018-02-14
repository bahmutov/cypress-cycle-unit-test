/// <reference types="Cypress" />

import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

// mounts given view "main" function in the test runner
export const mount = main => {
  cy.window().then(win => {
    run(main, {
      DOM: makeDOMDriver(win.document.body)
    })
  })
}
