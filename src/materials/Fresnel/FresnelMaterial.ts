import { ShaderMaterial, Color } from 'three'
import { FresnelFragment, FresnelVertex } from './'
import { Renderer, Time } from '@/engine'

export default class FresnelMaterial extends ShaderMaterial {
  fragmentShader: string = FresnelFragment
  vertexShader: string = FresnelVertex

  constructor(color: Color|string|number = 0x000000, bloom: boolean = true, power: number = .5) {
    super()

    this.uniforms = {
      color: { value: color },
      power: { value: power },
      time: Time.time,
      bloom: { value: bloom },
      pass: Renderer.currentPass
    }
  }
}
