import { ShaderMaterial, Color, Texture } from 'three'
import { MatcapVertexShader, MatcapFragmentShader } from './'

export default class MatcapMaterial extends ShaderMaterial {
  vertexShader: string = MatcapVertexShader
  fragmentShader: string = MatcapFragmentShader

  constructor(texture: Texture, fogColor: number = 0x000000) {
    super()

    this.uniforms = {
      fogColor: { value: new Color(fogColor) },
      tMatcap: { value: texture }
    }
  }
}
