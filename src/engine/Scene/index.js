import { Scene } from 'three'

export default class GScene extends Scene {
  camera

  constructor (camera) {
    super()

    this.camera = camera
  }

  init () { }
}
