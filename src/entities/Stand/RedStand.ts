import { Object3D, MeshBasicMaterial } from 'three'
import { Resources, Entity } from '@/engine'

export default class RedStand extends Entity {
  async start(): Promise<void> {
    const model: Object3D = await Resources.loadObject(
      require('./RedStand_Model.fbx').default
    )

    model.traverse(async (node: any) => {
      if (node.isMesh) {
        node.material = new MeshBasicMaterial({
          map: await Resources.loadTexture(require('./Village_Color.png'))
        })
      }
    })

    this.add(model)
  }
}

