import BoxCollider from './BoxCollider.ts'
import SphereCollider from './SphereCollider.ts'
import { Vector3 } from 'three'
import { Entity } from '../World'
import { expect } from 'chai'

describe('BoxCollider', () => {
  it('should collide with box', () => {
    const a = new BoxCollider(new Entity(), new Vector3(1, 1, 1))
    const b = new BoxCollider(new Entity(), new Vector3(1, 1, 1))

    expect(a.intersectsWith(b)).to.be.true
  })

  it('should collide with sphere', () => {
    const a = new BoxCollider(new Entity(), new Vector3(1, 1, 1))
    const b = new SphereCollider(new Entity(), 1)

    expect(a.intersectsWith(b)).to.be.true
  })

  it('should track parent entity position', () => {
    const a = new BoxCollider(new Entity(), new Vector3(1, 1, 1))
    const b = new SphereCollider(new Entity(), 1)

    a.entity.addComponent(a)
    a.entity.position.set(4, 4, 4)
    a.entity.update()

    expect(a.intersectsWith(b)).to.be.false
  })
})
