import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'
import { Color, ShaderMaterial, Vector3 } from 'three'
import { world, resources } from '@GEngine'
import { BLOOM_LAYER } from '@GScene/layers'

export default async (params) => {
  const {
    position = new Vector3()
  } = params

  return {
    components: [
      { type: 'Transform', position },
      {
        type: 'MeshRenderer',
        mesh: await resources.loadObject(
          require('@/assets/Environment.fbx').default,
          new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              color: { type: 'v3', value: new Color(0x73858e) },
              fogColor: { type: 'v3', value: new Color(0x3b1400) },
              tMatcap: { value: await resources.loadTexture(require('@/assets/matcap.png')) }
            }
          })
        )
      }
    ]
  }
}

