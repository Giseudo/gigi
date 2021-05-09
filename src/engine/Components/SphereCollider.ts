import { Sphere } from 'three'
import { Entity } from '../World'
import Collider from './Collider'

/**
 * A sphere shaped Collider component.
 * @class
 * @memberof GEngine.Components
 * @extends {Collider}
 */
class SphereCollider extends Collider {
  constructor(entity: Entity, radius: number) {
    const sphere = new Sphere(entity.position, radius)

    super(entity, sphere)
  }
}

export default SphereCollider
