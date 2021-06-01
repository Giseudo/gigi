import { Object3D, PerspectiveCamera, Vector3 } from 'three'
import { RESIZE, UPDATE, INIT_CAMERA } from '../events'
import { subscribe, unsubscribe, publish } from '../Messenger'

export default class Camera extends PerspectiveCamera {
  private followOffset: Vector3 = new Vector3()
  private followTarget?: Object3D
  private width: number
  private height: number
  private previousPosition: Vector3

  constructor(width: number, height: number, fov: number = 60) {
    super(fov, width / height, .1, 2000)

    this.width = width
    this.height = height
    this.previousPosition = this.position
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

    this.position.lerp(desiredPosition, deltaTime * 5.)
  }

  lookAt (position: Vector3): void {
    super.lookAt(position.clone())
  }

  onResize = ({ width, height }: any) => {
    this.aspect = width / height
    this.updateProjectionMatrix()
  }

  onUpdate = ({ deltaTime }: any) => {
    if (this.followTarget) this.updatePosition(deltaTime)

    if (this.position.equals(this.previousPosition))
      this.dispatchEvent({ type: 'moved', position: this.position})
  }

  getScreenPosition = (pos: Vector3): Vector3 => {
    const width = this.width 
    const height = this.height 
    const widthHalf = width / 2
    const heightHalf = height / 2
    const position: Vector3 = pos.clone().add(new Vector3(0, 2.5, 0))

    position.project(this)
    position.x = (position.x * widthHalf) + widthHalf
    position.y = -(position.y * heightHalf) + heightHalf

    return position
  }
}
