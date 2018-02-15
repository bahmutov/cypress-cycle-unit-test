/// <reference types="Cypress" />

import xs from 'xstream'
import Item from '../../examples/many/Item'
import List from '../../examples/many/List'
import { mount } from '../..'

/* eslint-env mocha */
describe('example "many"', () => {
  context('Item', () => {
    beforeEach(() => {
      const drivers = {
        Props: () =>
          xs.of({
            color: 'red',
            width: 200
          })
      }
      mount(Item, drivers)
    })

    it('shows an item', () => {
      cy.get('.color-field').should('have.value', 'red')
      cy.contains('.width-content', 200)
      cy.get('.item').should('have.css', 'width', '200px')
    })

    it.skip('can change width by clicking on the range slider', () => {
      // how to click on the right side of the range slider?
      cy.get('.width-slider').click('center')
    })

    it.skip('can change width by dragging the range slider', () => {
      // how to drag the range slider?
    })

    it('changes color', () => {
      cy.get('.color-field').type('{selectall}{del}green')
      cy.get('.item').should('have.css', 'background-color', 'rgb(0, 128, 0)')
      // seems this destroys the width!
    })

    it('calls remove action', () => {
      cy.get('button.remove-btn').click()
      // TODO find way to intercept or spy on each mounted stream
      // in particular to spy on Remove stream from the Item
    })
  })

  context('List', () => {
    beforeEach(() => {
      mount(List)
    })

    it('can add and remove items', () => {
      cy.get('.item').should('have.length', 1)
      cy.get('.add-one-btn').click().click()
      cy.get('.item').should('have.length', 3)
      cy.get('.item').first().contains('Remove').click()
      cy.get('.item').should('have.length', 2)
    })

    it('can add many items', () => {
      cy.get('.item').should('have.length', 1)
      cy.get('.add-many-btn').click()
      cy.get('.item').should('have.length.gt', 1000)
    })
  })
})
