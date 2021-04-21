import { Object3D, Color, Mesh, MeshBasicMaterial } from 'three'
import { PlayerData } from '@/types'
import { Entity, Resources, BLOOM_LAYER, PRIMARY_AXIS } from '@/engine'
import { InputReader, Movement } from '@/components'
import { MatcapMaterial } from '@/materials'

export default class PlayerEntity extends Entity {
  data: PlayerData
  color: Color
  inputReader: InputReader
  movement: Movement
  isControllable: boolean

  constructor(data: PlayerData, color: number = 0xff2200, isControllable: boolean = false, orientation?: Object3D) {
    super()
    this.data = data
    this.color = new Color(color)
    this.isControllable = isControllable

    this.inputReader = this.addComponent(new InputReader(orientation))
    this.movement = this.addComponent(new Movement(50, 20))
  }

  async start(): Promise<void> {
    const model = await Resources.loadObject(require('./PlayerModel.fbx').default)

    model.traverse(async (node: Mesh) => {
      if (node.isMesh) {
        if (node.name === 'Emission') {
          node.material = new MeshBasicMaterial({ color: this.color })
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

    if (this.isControllable)
      return this.updatePosition(payload.deltaTime)

    this.syncPosition()
  }

  updatePosition(deltaTime: number): void {
    if (this.movement.isMoving)
      this.publish('changedPosition', this.position)

    this.movement.move(
      this.inputReader.getOrientedAxis(PRIMARY_AXIS)
    )

    this.position.add(
      this.movement.velocity.clone().multiplyScalar(deltaTime)
    )
  }

  syncPosition(): void {
    const { x, y, z } = this.data.position

    this.position.set(x, y, z)
  }
}

/* Stick to navmesh
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
 */
