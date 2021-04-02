import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'
import { Color, ShaderMaterial } from 'three'
import { world, resources } from '@GEngine'
import { BLOOM_LAYER } from '@GScene/layers'

export default async (params) => {
  return {
    components: [
      { type: 'Transform' },
      {
        type: 'MeshRenderer',
        mesh: await resources.loadObject(
          require('@/assets/Environment.fbx').default,
          new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              color: { type: 'v3', value: new Color(0x73858e) },
              fogColor: { type: 'v3', value: new Color(0x252428) },
              tMatcap: { value: await resources.loadTexture(require('@/assets/matcap.png')) }
            }
          })
        )
      }
    ]
  }
}

