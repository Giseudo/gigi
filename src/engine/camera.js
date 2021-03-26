import { PerspectiveCamera } from 'three'
import { RESIZE } from '@Events'
import { subscribe, unsubscribe } from '@Messenger'

export default class GCamera {
  mainCamera

  constructor () {
    this.mainCamera = new PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      10.,
      1000
    )
  }

  init () {
    subscribe(RESIZE, this.onResize)
  }

  destroy () {
    unsubscribe(RESIZE, this.onResize)
  }

  onResize = ({ width, height }) => {
    this.mainCamera.aspect = width / height
    this.mainCamera.updateProjectionMatrix()
  }
}
