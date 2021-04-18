import { Object3D, PerspectiveCamera, Vector3 } from 'three'
import { RESIZE, UPDATE, INIT_CAMERA } from '@/engine/Messenger/events'
import { subscribe, unsubscribe, publish } from '@/engine/Messenger'

export default class Camera extends PerspectiveCamera {
  followOffset: Vector3 = new Vector3()
  followTarget?: Object3D

  constructor() {
    super(90, window.innerWidth / window.innerHeight, .1, 1000)
  }

  init () {
    subscribe(RESIZE, this.onResize)
    subscribe(UPDATE, this.onUpdate)
    publish(INIT_CAMERA)
  }

  destroy () {
    unsubscribe(RESIZE, this.onResize)
  }

  follow (object: Object3D) {
    this.followTarget = object

    this.followOffset = this.followTarget.position.clone()
      .sub(this.position)
  }

  updatePosition (deltaTime: number) {
    if (!this.followTarget) return

    const desiredPosition = this.followTarget
      .position.clone()
      .sub(this.followOffset)

    this.position.lerp(desiredPosition, deltaTime * 2.)
    this.lookAt(this.followTarget.position)
  }

  onResize = ({ width, height }: any) => {
    this.aspect = width / height
    this.updateProjectionMatrix()
  }

  onUpdate = ({ deltaTime }: any) => {
    if (this.followTarget) this.updatePosition(deltaTime)
  }
}
