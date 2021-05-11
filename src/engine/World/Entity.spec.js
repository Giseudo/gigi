import Entity from './Entity.ts'
import { Component } from '../Components'
import { stub, spy } from 'sinon'
import { expect } from 'chai'

class TestComponent extends Component {
  constructor(entity) {
    super(entity)
  }
}

describe('Entity', () => {
  const entity = new Entity()

  describe('components', () => {
    it('should add a component', () => {
      const component = new TestComponent(entity)

      expect(entity.components).to.be.contain(component)
    })

    it('should get a component from type', () => {
      const component = entity.getComponent(TestComponent)

      expect(component).to.exist
      expect(component).to.be.instanceOf(TestComponent)
    })

    it('should get multiple components from type', () => {
      new TestComponent(entity)
      new TestComponent(entity)

      expect(entity.components).to.be.length(3)
    })

    it('should remove a component', () => {
      const destroyStub = stub(entity.getComponent(TestComponent), 'destroy')
      entity.removeComponent(TestComponent)
      expect(entity.components).to.be.length(2)
      expect(destroyStub.calledOnce).to.be.true
    })

    it('should remove multiple components', () => {
      entity.removeComponents(TestComponent)

      const components = entity.getComponents(TestComponent)

      expect(components).to.be.length(0)
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
