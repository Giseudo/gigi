import { ShaderMaterial, Color, Texture } from 'three'
import { MatcapVertexShader, MatcapFragmentShader } from './'
import { Renderer } from '@/engine'

export default class MatcapMaterial extends ShaderMaterial {
  vertexShader: string = MatcapVertexShader
  fragmentShader: string = MatcapFragmentShader
  toneMapped: boolean = true

  constructor(texture: Texture, color: Color|number|string = 0xffffff) {
    super()

    this.uniforms = {
      tMatcap: { value: texture },
      color: { value: new Color(color) },
      fogColor: Renderer.fogColor,
      pass: Renderer.currentPass
    }
  }
}
