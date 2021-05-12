import { NearestFilter, Object3D, Texture } from 'three'
import { Resources, Entity, SphereCollider } from '@/engine'
import { BasicMaterial } from '@/materials'

export default class BMOEntity extends Entity {
  collider: SphereCollider

  constructor() {
    super()

    this.collider = new SphereCollider(this, 8)
  }

  async onStart(): Promise<void> {
    const model: Object3D = await Resources.loadObject(require('./BMOModel.fbx').default)

    const color: Texture = await Resources.loadTexture(require('./BMOColor.png'))
    color.minFilter = NearestFilter
    color.magFilter = NearestFilter

    const emission: Texture = await Resources.loadTexture(require('./BMOEmission.png'))
    emission.minFilter = NearestFilter
    emission.magFilter = NearestFilter

    const material = new BasicMaterial(color, emission)

    model.traverse(async (node: any) => {
      if (node.isMesh) node.material = material
    })

    this.add(model)
  }
}
