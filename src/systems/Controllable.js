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
      const direction = this.getOrientedDirection(input, PRIMARY_AXIS)

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

  getOrientedDirection (input, axis) {
    const { mainCamera } = this.camera
    const direction = input.getAxis(axis)

    const right = new Vector3(1, 0, 0).applyQuaternion(mainCamera.quaternion)
    right.y = 0
    right.normalize()

    const forward = new Vector3(0, 0, -1).applyQuaternion(mainCamera.quaternion)
    forward.y = 0
    forward.normalize()

    return right.multiplyScalar(direction.x)
      .add(forward.multiplyScalar(direction.y))
  }
}
