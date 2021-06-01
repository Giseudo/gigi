import { NearestFilter, Object3D, Texture } from 'three'
import { Resources, Entity, SphereCollider } from '@/engine'
import { BasicMaterial } from '@/materials'
import { SpeechService } from '@/services'

export default class BMOEntity extends Entity {
  collider: SphereCollider
  speechService: SpeechService

  constructor(speechService: SpeechService) {
    super()

    this.components = [
      new SphereCollider(this, 8),
    ]

    this.speechService = speechService
    this.collider = this.getComponent(SphereCollider)
  }

  async onStart() {
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

    this.collider.addEventListener('collisionStart', this.onEntityApproach)
    this.collider.addEventListener('collisionEnd', this.onEntityMoveAway)

    this.add(model)
  }

  onDestroy() {
    this.collider.removeEventListener('collisionStart', this.onEntityApproach)
    this.collider.removeEventListener('collisionEnd', this.onEntityMoveAway)
  }

  onEntityApproach = () => {
    this.speechService.showBalloon(this, 'Hello friend! How are yooou? <3')
  }

  onEntityMoveAway = () => {
    this.speechService.hideBalloon(this)
  }
}
