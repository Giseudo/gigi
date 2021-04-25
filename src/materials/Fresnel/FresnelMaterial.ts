import { ShaderMaterial, Color } from 'three'
import { FresnelFragment, FresnelVertex } from './'

export default class FresnelMaterial extends ShaderMaterial {
  fragmentShader: string = FresnelFragment
  vertexShader: string = FresnelVertex

  constructor(color: Color|string|number = 0x000000, power: number = .5) {
    super()

    this.uniforms = {
      color: { value: color },
      power: { value: power },
      time: { value: 0 }
    }
  }
}
