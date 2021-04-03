import { Vector3 } from 'three'
import { System } from 'ape-ecs'
import { PRIMARY_AXIS } from '@GInput'

export default class Controllable extends System {
  init () {
    this.mainQuery = this.createQuery()
      .fromAll('Transform', 'Rigidbody', 'InputReader')
      .persist()
  }

  update () {
    const { deltaTime } = this.world

    for (const entity of this.mainQuery.execute()) {
      const input = entity.getOne('InputReader')
      const transform = entity.getOne('Transform')
      const rigidbody = entity.getOne('Rigidbody')

      const { velocity, acceleration, maxVelocity } = rigidbody
      const direction = input.getOrientedAxis(PRIMARY_AXIS)

      if (direction.lengthSq() > .1)
        velocity.add(
          direction.multiplyScalar(acceleration * deltaTime)
        )
      else if (velocity.lengthSq() > .1)
        velocity.multiplyScalar(1.0 - deltaTime * 3.0)
      else
        velocity.set(0, 0, 0)

      velocity.clampLength(0, maxVelocity)
    }
  }
}
