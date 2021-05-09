import { Vector3, Box3 } from 'three'
import { Entity } from '../World'
import Collider from './Collider'

/**
 * A rectangle shaped Collider component.
 * @class
 * @memberof GEngine.Components
 * @extends {Collider}
 */
class BoxCollider extends Collider {
  constructor(entity: Entity, size: Vector3) {
    const box = new Box3(
      new Vector3( size.x,  size.y,  size.z),
      new Vector3(-size.x, -size.y, -size.z)
    )

    super(entity, box)
  }
}

export default BoxCollider
