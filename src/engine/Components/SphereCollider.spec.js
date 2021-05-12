import BoxCollider from './BoxCollider.ts'
import SphereCollider from './SphereCollider.ts'
import { Vector3 } from 'three'
import { Entity } from '../World'
import { expect } from 'chai'

describe('SphereCollider', () => {
  describe('sphere x box', () => {
    it('should collide', () => {
      const a = new SphereCollider(new Entity(), 1)
      const b = new BoxCollider(new Entity(), new Vector3(1, 1, 1))

      expect(a.intersectsWith(b)).to.be.true
    })

    it('should not collide', () => {
      const a = new SphereCollider(new Entity(), 1)
      const b = new BoxCollider(new Entity(), new Vector3(1, 1, 1))

      b.entity.start()
      b.entity.position.set(0, 2, 0)
      b.entity.update()

      expect(a.intersectsWith(b)).to.be.false

      const c = new SphereCollider(new Entity(), 1, new Vector3(0, 2, 0))
      const d = new BoxCollider(new Entity(), new Vector3(1, 1, 1))

      expect(c.intersectsWith(d)).to.be.false
    })
  })

  describe('sphere x sphere', () => {
    it('should collide', () => {
      const a = new SphereCollider(new Entity(), 1)
      const b = new SphereCollider(new Entity(), 1)

      expect(a.intersectsWith(b)).to.be.true
    })

    it('should not collide', () => {
      const a = new SphereCollider(new Entity(), 1)
      const b = new SphereCollider(new Entity(), 1)

      b.entity.start()
      b.entity.position.set(0, 2.1, 0)
      b.entity.update()

      expect(a.intersectsWith(b)).to.be.false

      const c = new SphereCollider(new Entity(), 1, new Vector3(0, 2.1, 0))
      const d = new SphereCollider(new Entity(), 1)

      expect(c.intersectsWith(d)).to.be.false
    })
  })
})
