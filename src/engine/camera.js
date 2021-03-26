import { PerspectiveCamera, OrthographicCamera } from 'three'

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

  // getCamera = () => mainCamera
}
