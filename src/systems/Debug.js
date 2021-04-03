import { Vector3 } from 'three'
import { System } from 'ape-ecs'
import { scene } from '@GEngine'

export default class Debug extends System {
  init () {
    this.mainQuery = this.createQuery()
      .fromAll('Line', 'MeshRenderer')
      .persist()
  }

  update () {
    for (const entity of this.mainQuery.execute()) {
      const { geometry } = entity.getOne('MeshRenderer')
      const { origin, end } = entity.getOne('Line')

      geometry.setFromPoints([ origin, end ])
    }
  }
}
