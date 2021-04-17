import { Object3D, Vector2, Vector3 } from 'three'
import { subscribe, unsubscribe } from '@/engine/Messenger'
import { PRIMARY_AXIS } from '@/engine/Input'
import { AXIS_CHANGED } from '@/engine/Messenger/events'
import Component from '@/typescript/Component'

export default class InputReader extends Component {
  orientation: Object3D

  constructor(orientation: Object3D) {
    super()
    this.orientation = orientation
  }

  axes: any = {
    [PRIMARY_AXIS]: new Vector2()
  }

  start() {
    super.start()
    subscribe(AXIS_CHANGED, this.onAxisChange)
  }

  destroy() {
    super.destroy()
    unsubscribe(AXIS_CHANGED, this.onAxisChange)
  }

  onAxisChange = ({ axis, value }: any) => this.axes[axis].copy(value)

  getAxis (name: string) {
    const direction = this.axes[name]

    return direction
  }

  getOrientedAxis (name: string): Vector3 {
    const direction = this.getAxis(name)

    if (!this.orientation) return direction

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
