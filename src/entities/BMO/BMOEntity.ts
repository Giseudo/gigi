import { Object3D, MeshBasicMaterial } from 'three'
import { Resources, Entity, SphereCollider } from '@/engine'

export default class BMOEntity extends Entity {
  collider: SphereCollider

  constructor() {
    super()

    this.collider = new SphereCollider(this, 8)
  }

  async onStart(): Promise<void> {
    const model: Object3D = await Resources.loadObject(require('./BMOModel.fbx').default)

    model.traverse(async (node: any) => {
      if (node.isMesh) {
        node.material = new MeshBasicMaterial({
          map: await Resources.loadTexture(require('./BMOColor.png'))
        })
      }
    })

    this.add(model)
  }
}
