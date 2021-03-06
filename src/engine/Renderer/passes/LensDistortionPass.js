import vertexShader from '../shaders/FullScreenQuad.vert.glsl'
import fragmentShader from '../shaders/LensDistortion.frag.glsl'
import { ShaderMaterial, Vector2 } from 'three'
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
import { subscribe, RESIZE } from '@/engine'

export class LensDistortionPass extends Pass {
  uniforms
  material
  fsQuad

  constructor (intensity) {
    super()

    this.uniforms = {
      tDiffuse: { value: null },
      intensity: { value: intensity },
      resolution: { value: new Vector2() }
    }
    this.updateResolution()

    this.material = new ShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })

    this.fsQuad = new FullScreenQuad(this.material)

    subscribe(RESIZE, this.updateResolution)
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

  updateResolution = () => {
    if (window.innerWidth > window.innerHeight) {
      this.uniforms.resolution.value.x = window.innerWidth / 6
      this.uniforms.resolution.value.y = window.innerHeight / 6
    } else {
      this.uniforms.resolution.value.x = window.innerWidth
      this.uniforms.resolution.value.y = (window.innerHeight / 5) * 1.5
    }
  }
}
