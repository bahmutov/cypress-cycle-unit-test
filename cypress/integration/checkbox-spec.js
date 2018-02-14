// @ts-check
/// <reference types="Cypress" />

import { div, label, input, p } from '@cycle/dom'
import { mount } from '../..'

function main (sources) {
  const vdom$ = sources.DOM
    .select('input')
    .events('change')
    .map(ev => ev.target.checked)
    .startWith(false)
    .map(toggled =>
      div([
        input({ attrs: { type: 'checkbox' } }),
        'Toggle me',
        p(toggled ? 'ON' : 'off')
      ])
    )

  return {
    DOM: vdom$
  }
}

describe('Checkbox', () => {
  beforeEach(() => {
    mount(main)
  })

  it('can toggle on and off', () => {
    cy.contains('p', 'off')
    cy.get('input[type="checkbox"]').check()
    cy.contains('p', 'ON')
    cy.get('input[type="checkbox"]').uncheck()
    cy.contains('p', 'off')
  })
})
