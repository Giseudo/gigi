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
      const component = entity.addComponent(new TestComponent(entity))

      expect(entity.components).to.be.contain(component)
    })

    it('should get a component', () => {
      const component = entity.getComponent(TestComponent)

      expect(component).to.exist
      expect(component).to.be.instanceOf(TestComponent)
    })

    it('should remove a component', () => {
      const destroyStub = stub(entity.getComponent(TestComponent), 'destroy')
      entity.removeComponent(TestComponent)

      expect(() => entity.getComponent(TestComponent)).to.throw(Error)
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
