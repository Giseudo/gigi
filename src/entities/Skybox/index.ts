import { Mesh, BackSide, Color, SphereGeometry, ShaderMaterial } from 'three'
import { Entity } from '@/engine'
import fragmentShader from './skybox.frag.glsl'
import vertexShader from './skybox.vert.glsl'

export default class Skybox extends Entity {
  async start(): Promise<void> {
    const geometry = new SphereGeometry(500, 16, 16)
    const material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      side: BackSide,
      uniforms: {
        skyColor: {
          value: new Color(0x0fd6fc)
        },
        groundColor: {
          value: new Color(0x3b1400)
        }
      }
    })

    const mesh = new Mesh(geometry, material)

    this.add(mesh)
  }
}

