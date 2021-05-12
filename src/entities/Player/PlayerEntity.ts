import { Object3D, Color, Mesh, Vector3 } from 'three'
import { NavMesh, Entity, Resources, Collider, SphereCollider, PRIMARY_AXIS, UpdatePayload } from '@/engine'
import { InputReader, Movement } from '@/components'
import { MatcapMaterial, FresnelMaterial } from '@/materials'

export default class PlayerEntity extends Entity {
  inputReader: InputReader
  movement: Movement
  collider: Collider
  color: Color
  isControllable: boolean

  constructor(data: any, color: number = 0xff2200, isControllable: boolean = false, orientation?: Object3D) {
    super()

    this.components = [
      new InputReader(this, orientation),
      new Movement(this, 25, 10),
      new SphereCollider(this, 1.5, new Vector3(0, 1.5, 0))
    ]

    this.inputReader = this.getComponent(InputReader)
    this.movement = this.getComponent(Movement)
    this.collider = this.getComponent(SphereCollider)
    this.color = new Color(color)
    this.isControllable = isControllable

    this.userData.player = data
  }

  async onStart() {
    const model = await Resources.loadObject(require('./PlayerModel.fbx').default)
    const matcapMaterial = new MatcapMaterial(await Resources.loadTexture(require('./PlayerMatcap.png')))
    const fresnelMaterial = new FresnelMaterial(this.color, this.isControllable, .5)

    model.traverse(async (node: Mesh) => {
      if (node.isMesh) {
        if (node.name === 'Emission') node.material = fresnelMaterial
        if (node.name === 'Body') node.material = matcapMaterial
      }
    })

    this.syncPosition()
    this.add(model)
  }

  onUpdate(payload: UpdatePayload) {
    const { deltaTime } = payload

    if (this.isControllable)
      return this.updatePosition(deltaTime)

    this.syncPosition()
  }

  updatePosition(deltaTime: number) {
    if (this.movement.isMoving)
      this.publish('changedPosition', this.position)

    this.movement.move(this.inputReader.getOrientedAxis(PRIMARY_AXIS))

    const desiredPosition = this.position.clone()
      .add(this.movement.velocity.clone().multiplyScalar(deltaTime))

    const clampedPosition = NavMesh.ClampPosition(this.position, desiredPosition)

    this.position.copy(clampedPosition)
  }

  syncPosition() {
    const { x, y, z } = this.userData.player.position

    this.position.set(x, y, z)

    if (this.userData.player.direction)
      this.lookAt(this.position.clone().sub(this.userData.player.direction))
  }
}
