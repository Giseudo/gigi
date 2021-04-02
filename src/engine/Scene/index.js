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

    super.remove(object)

    delete object[id]
  }
}
