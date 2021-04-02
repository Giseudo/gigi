import { Vector3 } from 'three'
import { Component } from 'ape-ecs'

export default class Transform extends Component {
  static properties  = {
    position: new Vector3(),
    rotation: new Vector3(),
    scale: new Vector3(),
    parent: null,
    children: []
  }

  init () {
    this.position = this.position.clone()
    this.rotation = this.rotation.clone()
    this.scale = this.scale.clone()
  }

  up () {
    // TODO
  }

  forward () {
    // TODO
  }

  right () {
    // TODO
  }

  addChild (obj) {
    this.children.push(obj)
  }

  removeChild (obj) {
    const index = this.children.findIndex(obj)

    if (index < 0) return false

    return this.children.splice(index, 1)
  }
}
