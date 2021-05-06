import Entity from './Entity.ts'
import Component from './Component.ts'
import { stub, spy } from 'sinon'
import { expect } from 'chai'

describe('Entity', () => {
  const entity = new Entity()

  describe('components', () => {
    it('should add a component', () => {
      const component = entity.addComponent(new Component())

      expect(entity.components).to.be.contain(component)
    })

    it('should get a component', () => {
      const component = entity.getComponent(Component)

      expect(component).to.exist
    })

    it('should remove a component', () => {
      const destroyStub = stub(entity.getComponent(Component), 'destroy')
      entity.removeComponent(Component)

      expect(() => entity.getComponent(Component)).to.throw(Error)
      expect(destroyStub.calledOnce).to.be.true
    })

    it('should disable', () => {
      const disableSpy = spy()
      entity.subscribe('disabled', disableSpy)
      entity.disable()

      expect(entity.visible).to.be.false
      expect(entity.isEnabled).to.be.false
      expect(disableSpy.calledOnce).to.be.true
    })

    it('should enable', () => {
      const enableSpy = spy()
      entity.subscribe('enabled', enableSpy)
      entity.enable()

      expect(entity.visible).to.be.true
      expect(entity.isEnabled).to.be.true
      expect(enableSpy.calledOnce).to.be.true
    })
  })
})
