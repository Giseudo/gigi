import { Vector3, Sphere } from 'three'
import { Debug } from '../Debug'
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

  constructor(entity: Entity, radius: number, center: Vector3 = new Vector3()) {
    super(entity, center)

    const position = entity.position.clone().add(center)

    this.geometry = new Sphere(position, radius)

    this.gizmos.add(Debug.CreateSphere(radius, center, 0x00ff00))
  }

  public intersectsWith(other: Collider): boolean {
    let intersects = false

    if (other instanceof BoxCollider) {
      const a = this.geometry
      const b = other.geometry

      intersects = b.intersectsSphere(a)
    }

    if (other instanceof SphereCollider) {
      const a = this.geometry
      const b = other.geometry as Sphere

      intersects = a.intersectsSphere(b)
    }

    this.updateContacts(other, intersects)

    return intersects
  }

  public update() {
    const position = this.entity.position.clone().add(this.center)
    this.geometry.center.copy(position)
  }
}

export default SphereCollider
