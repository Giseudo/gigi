import { Box3, Sphere, Plane } from 'three'
import { Entity, Component } from '../../World'

enum CollisionLayer {
  Default = 0
}

/**
 * The base Collider component.
 * @class
 * @memberof GEngine.Physics
 * @extends {Component}
 */
class Collider extends Component {
  layer: CollisionLayer = CollisionLayer.Default
  trigger: boolean = true
  geometry: Box3|Sphere|Plane

  constructor(entity: Entity, geometry: Box3|Sphere|Plane) {
    super(entity)

    this.geometry = geometry
  }
}

export default Collider
