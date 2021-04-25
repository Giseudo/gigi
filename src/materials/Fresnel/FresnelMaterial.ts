import { ShaderMaterial, Color } from 'three'
import { FresnelFragment, FresnelVertex } from './'

export default class FresnelMaterial extends ShaderMaterial {
  fragmentShader: string = FresnelFragment
  vertexShader: string = FresnelVertex

  constructor(firstColor: Color|string|number = 0x000000, secondColor: Color|string|number = 0xffffff, power: number = .5) {
    super()

    this.uniforms = {
      firstColor: { value: firstColor },
      secondColor: { value: secondColor },
      power: { value: power }
    }
  }
}
