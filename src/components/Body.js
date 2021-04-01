import { Vector3 } from 'three'
import { Component } from 'ape-ecs'

export default class Body extends Component { }

Body.properties = {
  velocity: new Vector3(),
  maxVelocity: 20.0,
  acceleration: 60.0,
  useGravity: false
}