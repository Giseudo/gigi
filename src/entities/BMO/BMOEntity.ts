import { NearestFilter, Object3D, Texture } from 'three'
import { Resources, Entity, SphereCollider } from '@/engine'
import { BasicMaterial } from '@/materials'
import Speaker from '@/components/Speaker'

export default class BMOEntity extends Entity {
  collider: SphereCollider
  speaker: Speaker

  constructor() {
    super()

    this.components = [
      new SphereCollider(this, 8),
      new Speaker(this)
    ]

    this.collider = this.getComponent(SphereCollider)
    this.speaker = this.getComponent(Speaker)
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

    this.collider.subscribe('collisionStart', this.onEntityApproach)
    this.collider.subscribe('collisionEnd', this.onEntityMoveAway)

    this.add(model)
  }

  onDestroy() {
    this.collider.unsubscribe('collisionStart', this.onEntityApproach)
    this.collider.unsubscribe('collisionEnd', this.onEntityMoveAway)
  }

  onEntityApproach = () => {
    this.speaker.speak('HEYA')
  }

  onEntityMoveAway = () => {
    this.speaker.shutUp()
  }
}
