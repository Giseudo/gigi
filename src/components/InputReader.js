import { Vector2, Vector3 } from 'three'
import { Component } from 'ape-ecs'
import { subscribe, unsubscribe } from '@GMessenger'
import { PRIMARY_AXIS } from '@GInput'
import { AXIS_CHANGED } from '@GEvents'

export default class InputReader extends Component {
  init () {
    subscribe(AXIS_CHANGED, this.onAxisChange)
  }

  destroy () {
    unsubscribe(AXIS_CHANGED, this.onAxisChange)
  }

  onAxisChange = ({ axis, value }) => this.axes[axis].copy(value)

  getAxis (name) {
    const direction = this.axes[name]

    return direction
  }

  getOrientedAxis (name) {
    const direction = this.getAxis(name)

    const right = new Vector3(1, 0, 0)
      .applyQuaternion(this.orientation.quaternion)
    right.y = 0
    right.normalize()

    const forward = new Vector3(0, 0, -1)
      .applyQuaternion(this.orientation.quaternion)
    forward.y = 0
    forward.normalize()

    return right.multiplyScalar(direction.x)
      .add(forward.multiplyScalar(direction.y))
  }
}

InputReader.properties = {
  orientation: null,
  axes: {
    [PRIMARY_AXIS]: new Vector2() 
  }
}
