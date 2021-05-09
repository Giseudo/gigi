import { Vector3 } from 'three'
import { Component, Entity, UpdatePayload } from '@/engine'

export default class Movement extends Component {
  isMoving: boolean = false
  velocity: Vector3 = new Vector3()
  direction: Vector3 = new Vector3()
  acceleration: number
  maxVelocity: number

  constructor(entity: Entity, acceleration: number = 50, maxVelocity: number = 20) {
    super(entity)

    this.acceleration = acceleration
    this.maxVelocity = maxVelocity
  }

  update({ deltaTime }: UpdatePayload) {
    const { direction, velocity, acceleration, maxVelocity } = this

    this.isMoving = velocity.lengthSq() > .5

    if (direction.lengthSq() > .1)
      velocity.add(
        direction.multiplyScalar(acceleration * deltaTime)
      )
    else if (velocity.lengthSq() > .1)
      velocity.multiplyScalar(1.0 - deltaTime * 3.0)
    else
      velocity.set(0, 0, 0)

    velocity.clampLength(0, maxVelocity)

    if (!this.entity) return

    const smoothDirection = new Vector3(0, 0, 1)
      .applyQuaternion(this.entity.quaternion)
      .lerp(direction, deltaTime * 10.)
      .add(this.entity.position)

    if (this.isMoving)
      this.publish('moved', { position: this.entity.position })

    this.entity.lookAt(smoothDirection)
  }

  move(direction: Vector3): void {
    this.direction = direction
  }
}
