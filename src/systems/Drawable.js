import { Vector3 } from 'three'
import { System } from 'ape-ecs'
import { scene } from '@GEngine'

export default class Drawable extends System {
  objects = {}

  init () {
    this.mainQuery = this.createQuery({ trackAdded: true, trackRemoved: true })
      .fromAll('Transform', 'MeshRenderer')
      .persist()
  }

  update () {
    for (const entity of this.mainQuery.removed) {
      const mesh = this.objects[entity.id]
      const { geometry, material } = mesh

      if (geometry) geometry.dispose()
      if (material) material.dispose()

      scene.remove(mesh)
      mesh.remove()

      delete this.objects[entity.id]
    }

    for (const entity of this.mainQuery.added) {
      const { mesh } = entity.getOne('MeshRenderer')

      this.objects[entity.id] = mesh

      scene.add(mesh)
    }

    for (const entity of this.mainQuery.execute()) {
      const { position } = entity.getOne('Transform')
      const { mesh } = entity.getOne('MeshRenderer')

      mesh.position.copy(position)
    }
  }
}
