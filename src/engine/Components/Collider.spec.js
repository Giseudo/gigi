import BoxCollider from './BoxCollider'
import { Entity } from '../World'
import { Vector3 } from 'three'
import { stub, spy } from 'sinon'
import { expect } from 'chai'

describe('Collider', () => {
  it('should fire collisionStart event when a collision happens', () => {
    const a = new BoxCollider(new Entity(), new Vector3(1, 1, 1))
    const b = new BoxCollider(new Entity(), new Vector3(1, 1, 1))
    const triggerEnterStub = stub(a, 'onTriggerEnter')
    const collisionStartSpy = spy()
    a.subscribe('collisionStart', collisionStartSpy)

    a.intersectsWith(b)

    expect(triggerEnterStub.calledOnce).to.be.true
    expect(collisionStartSpy.calledOnce).to.be.true
  })

  it('should fire collisionEnd event when a collision ends', () => {
    const a = new BoxCollider(new Entity(), new Vector3(1, 1, 1))
    const b = new BoxCollider(new Entity(), new Vector3(1, 1, 1))
    const triggerExitStub = stub(a, 'onTriggerExit')
    const collisionEndSpy = spy()
    a.subscribe('collisionEnd', collisionEndSpy)

    a.intersectsWith(b)

    a.entity.start()
    a.entity.position.set(5, 5, 5)
    a.entity.update()
    
    expect(a.intersectsWith(b)).to.be.false
    expect(triggerExitStub.calledOnce).to.be.true
    expect(collisionEndSpy.calledOnce).to.be.true
  })
})
