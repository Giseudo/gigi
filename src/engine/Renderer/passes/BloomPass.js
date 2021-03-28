import { ShaderMaterial, UniformsUtils, NearestFilter } from 'three'
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js'
// import vertexShader from '../shaders/LensDistortion.vert.glsl'
// import fragmentShader from '../shaders/LensDistortion.frag.glsl'

export class BloomPass extends Pass {
  uniforms
  material
  fsQuad

  constructor (intensity) {
    super()

    this.uniforms = {
      tDiffuse: { value: null },
      intensity: { value: intensity }
    }

    this.material = new ShaderMaterial( {
      uniforms: this.uniforms,
      // vertexShader: vertexShader,
      // fragmentShader: fragmentShader
    })

    this.fsQuad = new Pass.FullScreenQuad(this.material)
  }

	render (renderer, writeBuffer, readBuffer, deltaTime) {
 		this.uniforms.tDiffuse.value = readBuffer.texture

		if (this.renderToScreen) {
			renderer.setRenderTarget(null)
			this.fsQuad.render(renderer)
		} else {
			renderer.setRenderTarget(writeBuffer)
			if (this.clear) renderer.clear()
			this.fsQuad.render(renderer)
		}
	}
}
