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
  geometry: Box3|Sphere|Plane

  constructor(entity: Entity, geometry: Box3|Sphere|Plane) {
    super(entity)

    this.geometry = geometry
  }
}

export default Collider
