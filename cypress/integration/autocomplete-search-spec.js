/// <reference types="Cypress" />

import xs from 'xstream'
import AutocompleteSearch from '../../examples/autocomplete-search/app'
import { makeJSONPDriver } from '@cycle/jsonp'
import { timeDriver } from '@cycle/time'
import { mount } from '../..'

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
    mount(AutocompleteSearch, drivers)
  })

  it('shows search form', () => {
    cy.get('.autocompleteable').should('be.visible')
    cy.contains('Some field:')
  })
})
