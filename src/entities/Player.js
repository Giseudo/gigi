import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'
import { Color, ShaderMaterial, CylinderGeometry, MeshBasicMaterial, Vector3 } from 'three'
import { world, resources } from '@GEngine'
import { BLOOM_LAYER } from '@GScene/layers'

export default async (params) => {
  const {
    position = new Vector3(),
    rotation = new Vector3(),
    scale = new Vector3(),
    acceleration = 50,
    maxVelocity = 20,
  } = params

  const navigator = await resources.loadObject(require('@/assets/Navigator.fbx').default)
  const matcap = await resources.loadTexture(require('@/assets/matcap.png'))

  navigator.traverse(node => {
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

  return {
    components: [
      { type: 'Transform', position, rotation, scale },
      { type: 'Rigidbody', acceleration, maxVelocity },
      {
        type: 'MeshRenderer',
        mesh: navigator,
      },
    ]
  }
}

