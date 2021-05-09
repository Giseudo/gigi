import { Vector3 } from 'three'
import { Entity } from '../World'
import { BoxCollider, SphereCollider } from './Components'
import { expect } from 'chai'
import Space from './Space.ts'

describe('Space', () => {
  const space = new Space()
  const entity = new Entity()

  describe('initialization', async () => {
    await space.init()
  })

  describe('shapes manipulation', () => {
    const box = new BoxCollider(entity, new Vector3(1, 1, 1))
    const sphere = new SphereCollider(entity, 5.)

    it('should add a collider', () => { 
      space.addCollider(box)
      expect(space.colliders).to.be.length(1)
    })

    it('should no remove an non existent collider', () => {
      space.removeCollider(sphere)
      expect(space.colliders).to.be.length(1)
    })

    it('should remove a shape', () => {
      space.removeCollider(box)
      expect(space.colliders).to.be.length(0)
    })
  })
})
