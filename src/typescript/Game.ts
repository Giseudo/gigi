import { Vector3, Quaternion, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'
import { PlayerData } from './types'
import { scene } from '../engine'
import Component from './Component'
import Entity from './Entity'
import World from './World'

class Transform extends Component {
  position: Vector3
  rotation: Quaternion
  scale: Vector3

  constructor (
    position: Vector3 = new Vector3(),
    rotation: Quaternion = new Quaternion(),
    scale: Vector3 = new Vector3(1, 1, 1)
  ) {
    super()

    this.position = position
    this.rotation = rotation
    this.scale = scale
  }

  update() {
    if (!this.entity?.object) return

    this.entity.object.position.copy(this.position)
    this.entity.object.quaternion.copy(this.rotation)
    this.entity.object.scale.copy(this.scale)
  }
}

class Player extends Entity {
  data: PlayerData
  transform: Transform

  constructor(data: PlayerData) {
    super()

    this.transform = this.addComponent(new Transform())
    this.data = data
  }

  async start(): Promise<void> {
    const geometry = new SphereGeometry(5, 5)
    const material = new MeshBasicMaterial({ color: 0xff0000 })

    this.object = new Mesh(geometry, material)
    this.transform.position.copy(this.data.position)

    super.start()
  }
}

const world: World = new World(scene)

const playerData = {
  id: 'xgh-1r3-ai2',
  position: new Vector3(0, 0, 20)
}

world.addEntity(new Player(playerData))

export { world }
