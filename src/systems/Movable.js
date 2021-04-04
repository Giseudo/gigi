import { Vector3 } from 'three'
import { System } from 'ape-ecs'
import { navMesh } from '@GEngine'

export default class Movable extends System {
  init () {
    this.mainQuery = this.createQuery()
      .fromAll('Transform', 'Rigidbody').persist()
  }

  update () {
    const { deltaTime } = this.world

    for (const entity of this.mainQuery.execute()) {
      const { velocity } = entity.getOne('Rigidbody')
      const transform = entity.getOne('Transform')
      const region = navMesh.getRegionForPoint(transform.position)
      const startPosition = transform.position.clone()

      if (region) this.region = region

      transform.position.add(
        velocity.clone().multiplyScalar(deltaTime)
      )

      const endPosition = transform.position.clone()

      navMesh.clampMovement(
        this.region,
        startPosition,
        endPosition,
        transform.position
      )
    }
  }
}
