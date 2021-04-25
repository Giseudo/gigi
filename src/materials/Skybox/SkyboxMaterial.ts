import { ShaderMaterial, Color, BackSide } from 'three'
import { Renderer } from '@/engine'
import { SkyboxVertexShader, SkyboxFragmentShader } from './'

export default class SkyboxMaterial extends ShaderMaterial {
  vertexShader: string = SkyboxVertexShader
  fragmentShader: string =  SkyboxFragmentShader
  side: number = BackSide
  toneMapped: boolean = false

  constructor (skyColor: Color|string|number) {
    super()
    this.uniforms = {
      skyColor: { value: new Color(skyColor) },
      groundColor: Renderer.fogColor 
    }
  }
}
