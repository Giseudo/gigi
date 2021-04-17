import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'
import { Color, ShaderMaterial, Object3D } from 'three'
import { resources, Entity } from '@/engine'

export default class Environment extends Entity {
  async start(): Promise<void> {
    const model: Object3D = await resources.loadObject(
      require('@/assets/Environment.fbx').default,
    )

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { value: new Color(0x73858e) },
        fogColor: { value: new Color(0x3b1400) },
        tMatcap: { value: await resources.loadTexture(require('@/assets/matcap.png')) }
      }
    })

    model.traverse((node: any) => {
      if (node.isMesh) node.material = material
    })

    this.add(model)
  }
}

