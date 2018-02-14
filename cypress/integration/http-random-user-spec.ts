/// <reference types="Cypress" />

import { Stream } from 'xstream';
import { div, button, h1, h4, a, DOMSource } from '@cycle/dom';
import { makeHTTPDriver, Response, HTTPSource } from '@cycle/http';
import { mount } from '../..'

type UserData = {
  id: number,
  name: string,
  username: string,
  email: string,
  address: {
    street: string,
    suite: string,
    city: string,
    zipcode: string,
    geo: {
      lat: string,
      lng: string,
    },
  },
  phone: string,
  website: string,
  company: {
    name: string,
    catchPhrase: string,
    bs: string,
  },
};

function main(sources: { DOM: DOMSource, HTTP: HTTPSource }) {
  const getRandomUser$ = sources.DOM.select('.get-random').events('click')
    .map(() => {
      const randomNum = Math.round(Math.random() * 9) + 1;
      return {
        url: 'https://jsonplaceholder.typicode.com/users/' + String(randomNum),
        category: 'users',
        method: 'GET',
      };
    });

  const user$ = sources.HTTP.select('users')
    .flatten()
    .map(res => res.body as UserData)
    .startWith(null);

  const vdom$ = user$.map(user =>
    div('.users', [
      button('.get-random', 'Get random user'),
      user === null ? null : div('.user-details', [
        h1('.user-name', user.name),
        h4('.user-email', user.email),
        a('.user-website', { attrs: { href: user.website } }, user.website),
      ]),
    ]),
  );

  return {
    DOM: vdom$,
    HTTP: getRandomUser$,
  };
}

/* eslint-env mocha */
describe('Http random user', () => {
  beforeEach(() => {
    mount(main, {
      HTTP: makeHTTPDriver()
    })
  })

  it('loads random user', () => {
    cy.server()
    cy.route('/users/*').as('xhr')
    cy.get('.get-random').click()
    cy.wait('@xhr')
    cy.get('.user-details').should('be.visible')
  })

  it('stubs random user XHR', () => {
    const user = {
      id: 101,
      name: 'Test User',
      email: 'test@cypress.io',
      website: 'https://cypress.io'
    }
    cy.server()
    cy.route({
      url: '/users/*',
      response: user
    })
    cy.get('.get-random').click()
    cy.get('.user-details').should('be.visible')
      .contains('test@cypress.io')
  })
})
