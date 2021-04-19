import { ShaderMaterial, Texture, RepeatWrapping } from 'three'
import { TriplanarVertexShader, TriplanarFragmentShader } from './'
import { Resources } from '@/engine'

export default class TriplanarMaterial extends ShaderMaterial {
  vertexShader: string = TriplanarVertexShader
  fragmentShader: string = TriplanarFragmentShader

  constructor(topTexture: Texture, sideTexture: Texture) {
    super()

    Resources.loadTexture('@/assets/textures/PixelNoise.jpeg')
      .then(texture => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        this.uniforms.tNoise = { value: texture }
      })

    topTexture.wrapS = RepeatWrapping
    topTexture.wrapT = RepeatWrapping
    sideTexture.wrapS = RepeatWrapping
    sideTexture.wrapT = RepeatWrapping

    this.uniforms.tTop = { value: topTexture }
    this.uniforms.tSide = { value: sideTexture }

  }
}
