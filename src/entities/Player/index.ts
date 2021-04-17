import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'
import { Object3D, Color, Mesh, ShaderMaterial, MeshBasicMaterial } from 'three'
import { PlayerData } from '@/typescript/types'
import { Entity, resources } from '@/engine'
import { BLOOM_LAYER } from '@/engine/Scene/layers'

type PlayerParams = {
  acceleration?: number, // 50
  maxVelocity?: number, // 20
  orientation?: Object3D
}

export default class Player extends Entity {
  data: PlayerData

  constructor(data: PlayerData, params?: PlayerParams) {
    super()
    this.data = data
  }

  async start(): Promise<void> {
    const model = await resources.loadObject(require('@/assets/Navigator.fbx').default)
    const matcap = await resources.loadTexture(require('@/assets/matcap.png'))

    this.add(model)

    model.traverse((node: Mesh) => {
      if (node.isMesh) {
        if (node.name === 'Emission') {
          node.material = new MeshBasicMaterial({ color: 0xff2200 })
          node.layers.enable(BLOOM_LAYER)
        }

        if (node.name === 'Body')
          node.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              color: {
                value: new Color(0xC0C0C0)
              },
              tMatcap: {
                value: matcap
              }
            }
          })
      }
    })

  }

  update() {
    const { x, y, z } = this.data.position

    this.position.set(x, y, z)
  }
}

