import { Vector3 } from 'three'
import { System } from 'ape-ecs'

export default class Movable extends System {
  init (camera) {
    this.mainQuery = this.createQuery()
      .fromAll('Transform', 'Body').persist()
  }

  update () {
    const { deltaTime } = this.world

    for (const entity of this.mainQuery.execute()) {
      const transform = entity.getOne('Transform')
      const { velocity } = entity.getOne('Body')

      transform.position.add(
        velocity.clone().multiplyScalar(deltaTime)
      )
    }
  }
}
