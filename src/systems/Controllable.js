import { Vector3 } from 'three'
import { System } from 'ape-ecs'
import { PRIMARY_AXIS } from '@Input'

export default class Controllable extends System {
  init (camera) {
    this.camera = camera
    this.mainQuery = this.createQuery()
      .fromAll('Transform', 'Body', 'InputReader')
      .persist()
  }

  update () {
    const { deltaTime } = this.world

    for (const entity of this.mainQuery.execute()) {
      const input = entity.getOne('InputReader')
      const transform = entity.getOne('Transform')
      const body = entity.getOne('Body')

      const { velocity, acceleration } = body
      const direction = input.getOrientedAxis(PRIMARY_AXIS)

      if (direction.lengthSq() > .1)
        velocity.add(
          direction.multiplyScalar(acceleration * deltaTime)
        )
      else if (velocity.lengthSq() > .1)
        velocity.multiplyScalar(1.0 - deltaTime * 3.0)
      else
        velocity.set(0, 0, 0)

      velocity.clampLength(0, body.maxVelocity)
    }
  }
}
