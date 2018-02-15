/// <reference types="Cypress" />

import xs from 'xstream'
import AutocompleteSearch from '../../examples/autocomplete-search/app'
import { makeJSONPDriver } from '@cycle/jsonp'
import { timeDriver } from '@cycle/time'
import { mount } from '../..'
import jsonp from 'jsonp'

/* eslint-env mocha */
describe('autocomplete-search', () => {
  function preventDefaultSinkDriver (prevented$) {
    prevented$.addListener({
      next: ev => {
        ev.preventDefault()
        if (ev.type === 'blur') {
          ev.target.focus()
        }
      },
      error: () => {},
      complete: () => {}
    })
    return xs.empty()
  }

  beforeEach(() => {
    const drivers = {
      JSONP: makeJSONPDriver(),
      preventDefault: preventDefaultSinkDriver,
      Time: timeDriver
    }
    // hmm, why is jsonp undefined in the test?
    cy.window().then(win => {
      win.jsonp = jsonp
    })
    mount(AutocompleteSearch, drivers)
  })

  it('shows search form', () => {
    cy.get('.autocompleteable').should('be.visible') // .type('foo')
    cy.contains('Some field:')
  })
})
