import Component from './Component.ts'
import { Entity } from '../World'
import { spy } from 'sinon'
import { expect } from 'chai'

describe('Component', () => {
  const entity = new Entity()
  const component = new Component(entity)

  it('should disable', () => {
    const disableSpy = spy()
    component.subscribe('disabled', disableSpy)
    component.disable()

    expect(component.isEnabled).to.be.false
    expect(disableSpy.calledOnce).to.be.true
  })

  it('should enable', () => {
    const enableSpy = spy()
    component.subscribe('enabled', enableSpy)
    component.enable()

    expect(component.isEnabled).to.be.true
    expect(enableSpy.calledOnce).to.be.true
  })
})
