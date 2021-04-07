import { Vector3, Color, SphereGeometry, ShaderMaterial, NearestFilter } from 'three'
import { resources } from '@GEngine'
import fragmentShader from './skybox.frag.glsl'
import vertexShader from './skybox.vert.glsl'

export default async (params) => {
  // const { } = params

  const geometry = new SphereGeometry(500, 16, 16)
  const material = new ShaderMaterial({
    fragmentShader,
    vertexShader,
    side: THREE.BackSide,
    uniforms: {
      skyColor: {
        value: new Color(0x0fd6fc)
      },
      groundColor: {
        value: new Color(0x3b1400)
      }
    }
  })

  return {
    components: [
      { type: 'Transform' },
      {
        type: 'MeshRenderer',
        geometry: geometry,
        material: material,
      },
    ]
  }
}
