import { ShaderMaterial, UniformsUtils, NearestFilter, Layer, MeshBasicMaterial, Vector2, Layers, Color } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { BLOOM_LAYER } from '@Scene/layers'
import vertexShader from '../shaders/FullScreenQuad.vert.glsl'
import fragmentShader from '../shaders/Bloom.frag.glsl'

const bloomLayer = new Layers()
bloomLayer.set(BLOOM_LAYER)

export class BloomPass extends Pass {
  scene = null
  camera = null
  uniforms = null

  material = null
  darkMaterial = null
  materials = {}

  composer = null
  renderPass = null
  bloomPass = null
  finalPass = null
  clearColor = new Color()

  constructor (scene, camera, renderer) {
    super()
    renderer.getClearColor(this.clearColor)

    this.scene = scene
    this.camera = camera

    this.darkMaterial = new MeshBasicMaterial({ color: 0x000000 })

    this.composer = new EffectComposer(renderer)
    this.composer.renderToScreen = false

    this.uniforms = {
      tDiffuse: { value: null },
      tBloom: { value: this.composer.renderTarget2.texture }
    }

    this.renderPass = new RenderPass(scene, camera)
    this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), .5, 0, 0)
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    this.composer.addPass(this.renderPass)
    this.composer.addPass(this.bloomPass)

    this.fsQuad = new Pass.FullScreenQuad(this.material)
  }

	render (renderer, writeBuffer, readBuffer, deltaTime) {
    renderer.setClearColor(0x000000)
 		this.uniforms.tDiffuse.value = readBuffer.texture

    this.scene.traverse(this.darkenNonBloomed)
    this.composer.render()
    this.scene.traverse(this.restoreMaterial)
    renderer.setClearColor(this.clearColor)

		if (this.renderToScreen) {
			renderer.setRenderTarget(null)
			this.fsQuad.render(renderer)
		} else {
			renderer.setRenderTarget(writeBuffer)
			if (this.clear) renderer.clear()
			this.fsQuad.render(renderer)
		}
	}

  darkenNonBloomed = (obj) => {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material
      obj.material = this.darkMaterial
    }
  }

  restoreMaterial = (obj) => {
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid]
      delete this.materials[obj.uuid]
    }
  }
}
