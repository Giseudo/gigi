import { Vector2 } from 'three'
import { Component } from 'ape-ecs'
import { PRIMARY_AXIS } from '@Input'
import { subscribe, unsubscribe } from '@Messenger'
import { AXIS_CHANGED } from '@Events'

export default class InputReader extends Component {
  init () {
    subscribe(AXIS_CHANGED, this.onAxisChange)
  }

  destroy () {
    unsubscribe(AXIS_CHANGED, this.onAxisChange)
  }

  onAxisChange = ({ axis, value }) => {
    this.axis[axis].x = value.x
    this.axis[axis].y = value.y
  }

  getAxis (name) {
    return this.axis[name]
  }
}

InputReader.properties = {
  axis: {
    [PRIMARY_AXIS]: new Vector2() 
  }
}
