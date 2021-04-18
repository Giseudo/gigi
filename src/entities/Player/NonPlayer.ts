import { Object3D, Color, Mesh, ShaderMaterial, MeshBasicMaterial } from 'three'
import { PlayerData } from '@/types'
import { Entity, Resources, BLOOM_LAYER, PRIMARY_AXIS } from '@/engine'
import { Movement } from '@/components'
import { MatcapVertex, MatcapFragment } from '@/assets/shaders'

export default class NonPlayer extends Entity {
  data: PlayerData
  color: Color

  constructor(data: PlayerData, color: number = 0xff2200) {
    super()
    this.data = data
    this.color = new Color(color)
  }

  async start(): Promise<void> {
    const model = await Resources.loadObject(require('./Player_Model.fbx').default)

    const { x, y, z } = this.data.position
    this.position.set(x, y, z)

    this.add(model)

    model.traverse(async (node: Mesh) => {
      if (node.isMesh) {
        if (node.name === 'Emission') {
          node.material = new MeshBasicMaterial({ color: this.color })
          node.layers.enable(BLOOM_LAYER)
        }

        if (node.name === 'Body')
          node.material = new ShaderMaterial({
            vertexShader: MatcapVertex,
            fragmentShader: MatcapFragment,
            uniforms: {
              color: {
                value: new Color(0xC0C0C0)
              },
              tMatcap: {
                value: await Resources.loadTexture(require('./Player_Matcap.png'))
              }
            }
          })
      }
    })
  }

  update(payload: any) {
    super.update(payload)

    const { x, y, z } = this.data.position
    this.position.set(x, y, z)
  }
}