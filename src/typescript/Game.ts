import { Vector3, Object3D, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'
import { PlayerData } from './types'
import { scene as world, resources } from '../engine'
import Entity from './Entity'
import World from './World'
import Skybox from '@/entities/Skybox'

class Player extends Entity {
  data: PlayerData

  constructor(data: PlayerData) {
    super()
    this.data = data
  }

  async start(): Promise<void> {
    const geometry = new SphereGeometry(5, 5)
    const material = new MeshBasicMaterial({ color: 0xff0000 })

    this.add(new Mesh(geometry, material))
  }

  update() {
    const { x, y, z } = this.data.position

    this.position.set(x, y, z)
  }
}

class Stand extends Entity {
  async start(): Promise<void> {
    const model: Object3D = await resources.loadObject(
      require('@/assets/RedStand.fbx').default
    )

    model.traverse(async (node: any) => {
      if (node.isMesh) {
        node.material = new MeshBasicMaterial({
          map: await resources.loadTexture(require('@/assets/Opaque_Color.png'))
        })
      }
    })

    this.add(model)
  }
}

const playerData = {
  id: 'xgh-1r3-ai2',
  position: new Vector3(0, 15, -20)
}

const stand: Entity = new Stand()
stand.position.set(0, 0, -30)
stand.scale.set(3.5, 3.5, 3.5)

const skybox: Skybox = new Skybox()

world.add(stand)
world.add(skybox)
world.add(new Player(playerData))

export { world }
