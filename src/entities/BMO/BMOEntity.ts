import { Object3D, MeshBasicMaterial } from 'three'
import { Resources, Entity, SphereCollider } from '@/engine'

export default class BMOEntity extends Entity {
  collider: SphereCollider

  constructor() {
    super()

    this.collider = this.addComponent(new SphereCollider(this, 8))

    this.collider.subscribe('collisionStart', this.onCollisionStart)
    this.collider.subscribe('collisionEnd', this.onCollisionEnd)
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

  private onCollisionStart() {
    console.log('hey friend, lets talk!')
  }

  private onCollisionEnd() {
    console.log('okay, see ya!')
  }
}
