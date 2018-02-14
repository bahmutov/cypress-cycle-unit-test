/// <reference types="Cypress" />

import { div, label, input, hr, h1 } from '@cycle/dom'
import { mount } from '../..'

function main (sources) {
  const vdom$ = sources.DOM
    .select('.myinput')
    .events('input')
    .map(ev => ev.target.value)
    .startWith('')
    .map(name =>
      div([
        label('Name:'),
        input('.myinput', { attrs: { type: 'text' } }),
        hr(),
        h1(`Hello ${name}`)
      ])
    )
  return {
    DOM: vdom$
  }
}

describe('Hello World', () => {
  beforeEach(() => {
    mount(main)
  })

  it('shows greeting by name', () => {
    cy.get('.myinput').type('Cycle')
    cy.contains('h1', 'Hello Cycle')
  })
})
