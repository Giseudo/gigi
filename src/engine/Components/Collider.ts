import { Box3, Sphere, Plane } from 'three'
import { Entity } from '../World'
import Component from './Component'

enum CollisionLayer {
  Default = 0
}

/**
 * The base Collider component.
 * @class
 * @memberof GEngine.Components
 * @extends {Component}
 */
class Collider extends Component {
  layer: CollisionLayer = CollisionLayer.Default
  trigger: boolean = true
  geometry?: Box3|Sphere|Plane
  contacts: Array<Collider>

  constructor(entity: Entity) {
    super(entity)

    this.contacts = []
  }

  public intersectsWith(_: Collider): boolean { return false }

  protected updateContacts(other: Collider, intersects: boolean) {
    const previousContact = this.contacts.includes(other)
    if (!previousContact && intersects)
      this.startContact(other)

    if (previousContact && !intersects)
      this.endContact(other)
  }

  protected onTriggerEnter(_: Collider): void { }

  protected onTriggerExit(_: Collider): void { }

  private startContact(other: Collider) {
    if (this.trigger) this.onTriggerEnter(other)

    this.contacts.push(other)

    this.publish('collisionStart', { other })
  }

  private endContact(other: Collider) {
    const index = this.contacts.indexOf(other)

    if (index < 0) return
    if (this.trigger) this.onTriggerExit(other)

    this.contacts.splice(index, 1)

    this.publish('collisionEnd', { other })
  }
}

export default Collider