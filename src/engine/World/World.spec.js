import World from './World.ts'
import Entity from './Entity.ts'
import { stub } from 'sinon'
import { expect } from 'chai'

const updatePayloadMock = {
  deltaTime: 1/60,
  unscaledDeltaTime: 1/60,
  time: 0,
  unscaledTime: 0
}

describe('World', () => {
  const world = new World()

  // TODO Test events
  // describe('initialization', () => { })

  describe('entity manipulation', () => {
    const entity = new Entity()

    it('should have no entities at start', () => {
      expect(world.entities.length === 0, 'expected 0 entities')
    })

    it('should add entity', () => {
      world.addEntity(entity)
      expect(world.entities.length === 1, 'expected 1 entity')
    })

    it('should remove entity', () => {
      world.removeEntity(entity)
      expect(world.entities.length === 0, 'expected 0 entities')
    })
  })

  describe('update', () => {
    const stubs = []

    before(() => {
      for (let i = 0; i < 10; i++) {
        const entity = new Entity()
        const updateStub = stub(entity, "update")
        stubs.push(updateStub)
        world.addEntity(entity)
      }
    })

    it('should update every entity', () => {
      world.update(updatePayloadMock)

      for (const i in stubs) {
        const updateStub = stubs[i]

        expect(updateStub.calledOnce).to.be.true
      }
    })
  })
  
  describe('destruction', () => {
    const stubs = []

    before(() => {
      world.entities.forEach(entity => {
        const destroyStub = stub(entity, "destroy")
        stubs.push(destroyStub)
      })
    })

    it('should destroy every entity', () => {
      world.destroy()

      for (const i in stubs) {
        const destroyStub = stubs[i]

        expect(destroyStub.calledOnce).to.be.true
      }
    })
  })
})
