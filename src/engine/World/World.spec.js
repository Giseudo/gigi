import World from './World.ts'
import Entity from './Entity.ts'
import { stub, spy } from 'sinon'
import { expect } from 'chai'

const updatePayloadMock = {
  deltaTime: 1/60,
  unscaledDeltaTime: 1/60,
  time: 0,
  unscaledTime: 0
}

describe('World', () => {
  describe('initialization', () => {
    const world = new World()
    const startSpy = spy()

    world.addEventListener('started', startSpy)
    world.init()

    expect(startSpy.calledOnce).to.be.true
  })

  describe('entity manipulation', () => {
    const world = new World()
    const entity = new Entity()

    before(() => world.init())

    it('should have no entities at start', () => {
      expect(world.entities).to.be.length(0)
    })

    it('should add entity', () => {
      world.addEntity(entity)
      expect(world.entities).to.be.length(1)
    })

    it('should remove entity', () => {
      world.removeEntity(entity)
      expect(world.entities).to.be.length(0)
    })

    it('should add entity through instantiation', async () => {
      await Entity.Instantiate(new Entity())
      expect(world.entities).to.be.length(1)
    })
  })

  describe('update', () => {
    const world = new World()
    const stubs = []

    before(async () => {
      world.init()

      for (let i = 0; i < 10; i++) {
        const entity = await world.addEntity(new Entity())
        const updateStub = stub(entity, 'update')
        stubs.push(updateStub)
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
    const world = new World()
    const stubs = []

    before(async () => {
      world.init()

      for (let i = 0; i < 10; i++)
        await Entity.Instantiate(new Entity())

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
