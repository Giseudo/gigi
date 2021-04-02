import { Scene } from 'three'

export default class GScene extends Scene {
  objects = {}

  add (mesh, id) {
    super.add(mesh)

    this.objects[id] = mesh
  }

  remove (id) {
    const object = this.objects[id]

    if (!object) return

    const { material, geometry } = object

    if (material) material.dispose()
    if (geometry) geometry.dispose()

    super.remove(object)

    object.remove()

    delete object[id]
  }
}
