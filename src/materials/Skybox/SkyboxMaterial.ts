import { ShaderMaterial, Color, BackSide } from 'three'
import { SkyboxVertexShader, SkyboxFragmentShader } from './'

export default class SkyboxMaterial extends ShaderMaterial {
  vertexShader: string = SkyboxVertexShader
  fragmentShader: string =  SkyboxFragmentShader
  side: number = BackSide

  constructor (skyColor: number, groundColor: number) {
    super()
    this.uniforms = {
      skyColor: { value: new Color(skyColor) },
      groundColor: { value: new Color(groundColor) }
    }
  }
}
