import { Vector3, Box3 } from 'three'
import { OBB } from 'three/examples/jsm/math/OBB'
import { Entity } from '../World'
import { Debug } from '../Debug'
import Collider from './Collider'
import SphereCollider from './SphereCollider'

/**
 * A rectangle shaped Collider component.
 * @class
 * @memberof GEngine.Components
 * @extends {Collider}
 */
class BoxCollider extends Collider {
  size: Vector3
  center: Vector3
  geometry: OBB

  get minPosition(): Vector3 {
    return this.entity.position.clone().sub(this.size)
  }

  get maxPosition(): Vector3 {
    return this.entity.position.clone().add(this.size)
  }

  constructor(entity: Entity, size: Vector3, center: Vector3 = new Vector3()) {
    super(entity)

    this.size = size
    this.center = center

    this.geometry = new OBB(center, size)

    const box = new Box3(this.minPosition, this.maxPosition)

    this.geometry.fromBox3(box)

    this.gizmos.add(Debug.CreateBox3(box, 0x00ff00))
  }

  public intersectsWith(other: Collider): boolean {
    let intersects = false

    if (other instanceof BoxCollider) {
      const a = this.geometry
      const b = other.geometry

      intersects = a.intersectsOBB(b, Number.EPSILON)
    }

    if (other instanceof SphereCollider) {
      const a = this.geometry
      const b = other.geometry

      intersects = a.intersectsSphere(b)
    }

    this.updateContacts(other, intersects)

    return intersects
  }

  public update(): void {
    this.updatePosition()
  }

  private updatePosition() {
    this.geometry.center.copy(this.entity.position)
    this.geometry.rotation.setFromMatrix4(this.entity.matrix)
  }
}

export default BoxCollider
