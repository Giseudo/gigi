import { Vector3 } from 'three'
import { System } from 'ape-ecs'
import { scene } from '@GEngine'

export default class Drawable extends System {
  init () {
    this.mainQuery = this.createQuery()
      .fromAll('Transform', 'MeshRenderer')
      .persist()

    this.subscribe('MeshRenderer')
  }

  update () {
    for (const event of this.changes) {
      if (event.op === 'add') {
        const { mesh } = this.world.getComponent(event.component)

        scene.add(mesh, event.component)
      }

      if (event.op === 'destroy')
        scene.remove(event.component)
    }

    for (const entity of this.mainQuery.execute()) {
      const { position } = entity.getOne('Transform')
      const { mesh } = entity.getOne('MeshRenderer')

      mesh.position.copy(position)
    }
  }
}
