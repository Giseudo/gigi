import { Object3D, Color, Mesh, MeshBasicMaterial } from 'three'
import { Entity, NavMesh, Resources, Debug, BLOOM_LAYER, PRIMARY_AXIS } from '@/engine'
import { InputReader, Movement } from '@/components'
import { MatcapMaterial, FresnelMaterial } from '@/materials'

export default class PlayerEntity extends Entity {
  inputReader: InputReader
  movement: Movement
  isControllable: boolean
  fresnelMaterial: FresnelMaterial

  constructor(data: any, color: number = 0xff2200, isControllable: boolean = false, orientation?: Object3D) {
    super()
    this.isControllable = isControllable
    this.userData.player = data

    this.inputReader = this.addComponent(new InputReader(orientation))
    this.movement = this.addComponent(new Movement(25, 10))
    this.fresnelMaterial = new FresnelMaterial(new Color(color), .5)
  }

  async start(): Promise<void> {
    const model = await Resources.loadObject(require('./PlayerModel.fbx').default)

    model.traverse(async (node: Mesh) => {
      if (node.isMesh) {
        if (node.name === 'Emission') {
          node.material = this.fresnelMaterial

          if (this.isControllable)
            node.layers.enable(BLOOM_LAYER)
        }

        if (node.name === 'Body')
          node.material = new MatcapMaterial(await Resources.loadTexture(require('./PlayerMatcap.png')))
      }
    })

    this.syncPosition()
    this.add(model)
  }

  update(payload: any) {
    super.update(payload)

    const { deltaTime, time } = payload

    this.fresnelMaterial.uniforms.time.value = time

    if (this.isControllable)
      return this.updatePosition(deltaTime)

    this.syncPosition()
  }

  updatePosition(deltaTime: number): void {
    if (this.movement.isMoving)
      this.publish('changedPosition', this.position)

    this.movement.move(
      this.inputReader.getOrientedAxis(PRIMARY_AXIS)
    )

    const desiredPosition = this.position.clone().add(
      this.movement.velocity.clone().multiplyScalar(deltaTime)
    )
    const clampedPosition = NavMesh.ClampPosition(this.position, desiredPosition)

    this.position.copy(clampedPosition)
  }

  syncPosition(): void {
    const { x, y, z } = this.userData.player.position

    this.position.set(x, y, z)

    if (this.userData.player.direction)
      this.lookAt(this.position.clone().sub(this.userData.player.direction))
  }
}
