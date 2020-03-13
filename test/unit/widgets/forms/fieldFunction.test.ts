import { namedNode } from 'rdflib'
import ns from '../../../../src/ns'
import uiStore from '../../../../src/store'

import {
  field,
  fieldFunction,
  mostSpecificClassURI
} from '../../../../src/widgets/forms/fieldFunction'
import { clearStore } from '../../helpers/clearStore'

afterEach(() => {
  clearStore()
})

describe('mostSpecificClassURI', () => {
  it('exists', () => {
    expect(mostSpecificClassURI).toBeInstanceOf(Function)
  })
  it('reports the RDF type if there is only one', () => {
    const form = namedNode('http://example.com/#form')
    uiStore.add(form, ns.rdf('type'), namedNode('http://example.com/#type'), namedNode('http://example.com/'))
    expect(mostSpecificClassURI(form)).toEqual('http://example.com/#type')
  })
  it('reports the subtype if there are one super and one sub type', () => {
    const node = namedNode('http://example.com/#form')
    uiStore.add(node, ns.rdf('type'), namedNode('http://example.com/#human'), namedNode('http://example.com/'))
    uiStore.add(node, ns.rdf('type'), namedNode('http://example.com/#employee'), namedNode('http://example.com/'))
    uiStore.add(namedNode('http://example.com/#employee'), ns.rdfs('subClassOf'), namedNode('http://example.com/#human'), namedNode('http://example.com/'))
    expect(mostSpecificClassURI(node)).toEqual('http://example.com/#employee')
  })
})

describe('fieldFunction', () => {
  it('exists', () => {
    expect(fieldFunction).toBeInstanceOf(Object)
  })
  it('returns the field function if it exists', () => {
    // create a function for type http://example.com/#type
    const myFunction = () => document.createElement('div')
    field['http://example.com/#type'] = myFunction

    // create a field of type http://example.com/#type
    const form = namedNode('http://example.com/#form')
    uiStore.add(form, ns.rdf('type'), namedNode('http://example.com/#type'), namedNode('http://example.com/'))

    expect(fieldFunction(document, namedNode('http://example.com/#form'))).toEqual(myFunction)
  })

  it('returns an error block if subject type undefined', () => {
    const fn = fieldFunction(document, namedNode('http://example.com/#doesnt-exist'))
    const result = fn(document, document.createElement('div'), {},
      namedNode('http://example.com/#subject'),
      namedNode('http://example.com/#form'),
      namedNode('http://example.com/'),
      () => {})
    expect(result).toMatchSnapshot()
  })

  it('returns an error block if no matching function exists', () => {
    // create a field of type http://example.com/#unknown-type
    const form = namedNode('http://example.com/#form')
    uiStore.add(form, ns.rdf('type'), namedNode('http://example.com/#unknown-type'), namedNode('http://example.com/'))
    const fn = fieldFunction(document, namedNode('http://example.com/#form'))
    const result = fn(document, document.createElement('div'), {},
      namedNode('http://example.com/#subject'),
      namedNode('http://example.com/#form'),
      namedNode('http://example.com/'),
      () => {})
    expect(result).toMatchSnapshot()
  })
})
