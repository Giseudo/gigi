import { Mesh } from 'three'
import { Component } from 'ape-ecs'

export default class MeshRenderer extends Component {
  init () {
    if (this.mesh) {
      this.geometry = this.mesh.geometry
      this.material = this.mesh.material
    } else {
      this.mesh = new Mesh(this.geometry, this.material)
    }

    if (this.layer)
      this.mesh.layers.enable(this.layer)
  }
}

MeshRenderer.properties = {
  mesh: null,
  geometry: null,
  material: null,
  layer: null
}