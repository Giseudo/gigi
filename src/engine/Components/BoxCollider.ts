import { Vector3, Box3, Sphere } from 'three'
import { Entity } from '../World'
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
  geometry: Box3

  get minPosition(): Vector3 {
    return this.entity.position.clone().add(
      new Vector3(-this.size.x, -this.size.y, -this.size.z)
    )
  }

  get maxPosition(): Vector3 {
    return this.entity.position.clone().add(
      new Vector3(this.size.x, this.size.y, this.size.z)
    )
  }

  constructor(entity: Entity, size: Vector3) {
    super(entity)

    this.size = size

    this.geometry = new Box3(this.minPosition, this.maxPosition)
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

  public update(): void {
    this.updatePosition()
  }

  private updatePosition() {
    this.geometry.min = this.minPosition
    this.geometry.max = this.maxPosition
  }
}

export default BoxCollider
