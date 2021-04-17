import { Object3D, MeshBasicMaterial } from 'three'
import { resources, Entity } from '@/engine'

export default class Stand extends Entity {
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

