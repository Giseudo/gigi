import { Vector3 } from 'three'
import { Component } from 'ape-ecs'

export default class Rigidbody extends Component {
  static properties = {
    velocity: new Vector3(),
    maxVelocity: 20.0,
    acceleration: 60.0,
    useGravity: false
  }

  init () {
    this.velocity = this.velocity.clone()
  }
}
