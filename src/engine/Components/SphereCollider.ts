import { Box3, Sphere } from 'three'
import { Entity } from '../World'
import Collider from './Collider'
import BoxCollider from './BoxCollider'

/**
 * A sphere shaped Collider component.
 * @class
 * @memberof GEngine.Components
 * @extends {Collider}
 */
class SphereCollider extends Collider {
  geometry: Sphere

  constructor(entity: Entity, radius: number) {
    super(entity)

    this.geometry = new Sphere(entity.position, radius)
  }

  public intersectsWith(other: Collider): boolean {
    let intersects = false

    if (other instanceof BoxCollider) {
      const a = this.geometry
      const b = other.geometry as Box3

      intersects = a.intersectsBox(b)
    }

    if (other instanceof SphereCollider) {
      const a = this.geometry
      const b = other.geometry as Sphere

      intersects = a.intersectsSphere(b)
    }

    this.updateContacts(other, intersects)

    return intersects
  }
}

export default SphereCollider
