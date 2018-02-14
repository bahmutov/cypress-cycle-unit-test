// @ts-check
/// <reference types="Cypress" />

import xs from 'xstream'
import { div, button, p } from '@cycle/dom'
import { mount } from '../..'

function main (sources) {
  const action$ = xs.merge(
    sources.DOM.select('.decrement')
      .events('click')
      .map(ev => -1),
    sources.DOM.select('.increment')
      .events('click')
      .map(ev => +1)
  )
  const count$ = action$.fold((acc, x) => acc + x, 0)
  const vdom$ = count$.map(count =>
    div([
      button('.decrement', 'Decrement'),
      button('.increment', 'Increment'),
      p('Counter: ' + count)
    ])
  )
  return {
    DOM: vdom$
  }
}

/* eslint-env mocha */
describe('Counter', () => {
  beforeEach(() => {
    mount(main)
  })

  it('count up and down', () => {
    cy
      .get('.increment')
      .click()
      .click()
      .click()
      .click()
    cy.contains('Counter: 4')
    cy
      .get('.decrement')
      .click()
      .click()
    cy.contains('Counter: 2')
  })
})
