import { ShaderMaterial, Color } from 'three'
import { FloatVertex, FloatFragment } from './'
import { Time, Renderer } from '@/engine'

export default class FloatMaterial extends ShaderMaterial {
  vertexShader: string = FloatVertex
  fragmentShader: string = FloatFragment

  constructor (color: Color|string|number, speed: number = 1.0, distance: number = 20.0) {
    super()

    this.uniforms = {
      baseColor: { value: new Color(color) },
      speed: { value: speed },
      distance: { value: distance },
      time: Time.time,
      fogColor: Renderer.fogColor,
      pass: Renderer.currentPass
    }
  }
}
