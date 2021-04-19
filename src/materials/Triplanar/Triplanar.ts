import { ShaderMaterial, Texture, NearestFilter, RepeatWrapping } from 'three'
import { TriplanarVertexShader, TriplanarFragmentShader } from './'
import { Resources } from '@/engine'

export default class TriplanarMaterial extends ShaderMaterial {
  vertexShader: string = TriplanarVertexShader
  fragmentShader: string = TriplanarFragmentShader

  constructor(topTexture: Texture, sideTexture: Texture) {
    super()

    Resources.loadTexture(require('@/assets/textures/PixelNoise.jpeg'))
      .then(texture => {
        texture.minFilter = NearestFilter
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        this.uniforms.tNoise = { value: texture }
      })

    topTexture.magFilter = NearestFilter
    topTexture.wrapS = RepeatWrapping
    topTexture.wrapT = RepeatWrapping

    sideTexture.magFilter = NearestFilter
    sideTexture.wrapS = RepeatWrapping
    sideTexture.wrapT = RepeatWrapping

    this.uniforms.tTop = { value: topTexture }
    this.uniforms.tSide = { value: sideTexture }

  }
}
