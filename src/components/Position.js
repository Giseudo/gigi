import { Component } from 'ape-ecs'

export default class Position extends Component {
  init () { }
  preDestroy () { }
}

Position.properties = {
  x: 0,
  y: 0,
  z: 0
}
