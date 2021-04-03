import { Mesh } from 'three'
import { Component } from 'ape-ecs'
import { DEFAULT_LAYER } from '@GScene/layers'

export default class MeshRenderer extends Component {
  object

  static properties = {
    mesh: null,
    geometry: null,
    material: null,
    layer: DEFAULT_LAYER
  }

  init () {
    if (this.mesh) {
      this.geometry = this.mesh.geometry
      this.material = this.mesh.material
    } else {
      this.mesh = new Mesh(this.geometry, this.material)
    }

    if (this.layer)
      this.mesh.layers.enable(this.layer)

    this.object = this.mesh
  }
}
