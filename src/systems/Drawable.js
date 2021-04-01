import { Vector3 } from 'three'
import { System } from 'ape-ecs'

export default class Drawable extends System {
  init (scene) {
    this.scene = scene
    this.mainQuery = this.createQuery({ trackAdded: true, trackRemoved: true })
      .fromAll('Transform', 'MeshRenderer')
      .persist()
  }

  update () {
    for (const entity of this.mainQuery.added) {
      const { mesh } = entity.getOne('MeshRenderer')

      this.scene.add(mesh)
    }

    for (const entity of this.mainQuery.execute()) {
      const { position } = entity.getOne('Transform')
      const { mesh } = entity.getOne('MeshRenderer')

      mesh.position.copy(position)
    }

    for (const entity of this.mainQuery.removed) {
      const meshRenderer = entity.getOne('MeshRenderer')

      if (meshRenderer) this.scene.remove(meshRenderer.mesh)
    }
  }
}
