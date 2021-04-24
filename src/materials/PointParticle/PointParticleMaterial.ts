import { ShaderMaterial, CustomBlending, AddEquation, OneFactor, Color } from 'three'
import { PointParticleVertex, PointParticleFragment } from './'

export default class PointParticleMaterial extends ShaderMaterial {
  vertexShader: string = PointParticleVertex
  fragmentShader: string = PointParticleFragment

  depthTest: boolean = false
  blending: number = CustomBlending
  blendEquation: number = AddEquation
  blendSrc: number =  OneFactor
  blendDst: number = OneFactor

  constructor(
    color: number = 0xffffff,
    amplitude: number = 2.0,
    frequency: number = 5.0,
    speed: number = 5.0,
    timeOffset: number = 0.0,
    pointSize: number = 4.0
  ) {
    super()

    this.uniforms = {
      color: { value: new Color(color) },
      amplitude: { value: amplitude },
      frequency: { value: frequency },
      speed: { value: speed },
      timeOffset: { value: timeOffset },
      pointSize: { value: pointSize }

      // FIXME How do we get time?
      // time: vm.renderer.time,
      // deltaTime: vm.renderer.deltaTime,
    }
  }
}
