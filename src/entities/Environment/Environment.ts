import { Object3D } from 'three'
import { Resources, Entity } from '@/engine'
import { TriplanarMaterial, FloatMaterial } from '@/materials'
import { PanelEntity } from './'

export default class Environment extends Entity {
  panel?: PanelEntity

  async start(): Promise<void> {
    await this.createStructure()

    this.panel = await Entity.Instantiate(new PanelEntity(), this)
    this.panel.position.y = 15
    this.panel.position.z = -330
    this.panel.rotateX(Math.PI * .3)
  }

  destroy () {
    super.destroy()
    this.panel?.destroy()
  }

  async createTerrain () {
    const terrain: Object3D = await Resources.loadObject(
      require('./Terrain.fbx').default
    )

    const material = new TriplanarMaterial(
      await Resources.loadTexture(require('@/assets/textures/Grass.png')),
      await Resources.loadTexture(require('@/assets/textures/Stone.png'))
    )

    terrain.traverse((node: any) => {
      if (node.isMesh) node.material = material
    })

    terrain.position.set(20, 0, -20)

    this.add(terrain)
  }

  async createStructure () {
    const structure: Object3D = await Resources.loadObject(
      require('./Environment.fbx').default
    )

    const material = new FloatMaterial(0x7f9eae, await Resources.loadTexture(require('./EnvironmentColor.png')))

    structure.traverse((node: any) => {
      if (node.isMesh) node.material = material
    })

    this.add(structure)
  }
}

