import { Color, Vector3 } from 'three'
import { Component } from 'ape-ecs'

export default class Line extends Component {
  static properties = {
    origin: new Vector3(),
    end: new Vector3(),
    color: new Color(0xff0000)
  }

  init () {
    this.origin = this.origin.clone()
    this.end = this.end.clone()
  }
}
