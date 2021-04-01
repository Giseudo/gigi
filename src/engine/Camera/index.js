import { PerspectiveCamera, Vector3 } from 'three'
import { RESIZE, UPDATE, INIT_CAMERA } from '@Events'
import { subscribe, unsubscribe, publish } from '@Messenger'

export default class GCamera {
  mainCamera
  followOffset
  followTarget
  lookAtTarget

  constructor () {
    this.mainCamera = new PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      .1,
      1000
    )
  }

  init () {
    subscribe(RESIZE, this.onResize)
    subscribe(UPDATE, this.onUpdate)
    publish(INIT_CAMERA)
  }

  destroy () {
    unsubscribe(RESIZE, this.onResize)
  }

  lookAt (target) {
    this.lookAtTarget = target
  }

  follow (transform) {
    this.followTarget = transform

    this.followOffset = this.followTarget.position.clone()
      .sub(this.mainCamera.position)
  }

  updatePosition (deltaTime) {
    const desiredPosition = this.followTarget
      .position.clone()
      .sub(this.followOffset)

    this.mainCamera.position.lerp(desiredPosition, deltaTime * 2.)
  }

  updateDirection () {
    this.mainCamera.lookAt(this.lookAtTarget.position)
  }

  onResize = ({ width, height }) => {
    this.mainCamera.aspect = width / height
    this.mainCamera.updateProjectionMatrix()
  }

  onUpdate = ({ deltaTime }) => {
    if (this.followTarget) this.updatePosition(deltaTime)
    if (this.lookAtTarget) this.updateDirection()
  }
}
