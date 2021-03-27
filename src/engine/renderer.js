import { reactive, readonly } from 'vue'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass'
import { LensDistortionPass } from './passes/LensDistortionPass'
import {
  WebGLRenderer,
  WebGLRenderTarget,
  Clock,
  LinearFilter,
  NearestFilter,
  RGBFormat,
  DepthFormat,
  DepthTexture,
  UnsignedShortType,
  CineonToneMapping,
  Vector2,
  Matrix4
} from 'three'
import { UPDATE, DRAW, RESIZE, INIT_RENDERER } from '@Events'
import { publish, subscribe, unsubscribe } from '@Messenger'

const TIME_INTERVAL = 1 / 60

export default class GRenderer {
  scene = null
  camera = null
  target = null
  renderer = null
  composer = null
  clock = new Clock()
  width = window.innerWidth
  height = window.innerHeight
  time = new FloatNode(0.0)
  deltaTime = new FloatNode(0.0)

  uniforms = {
    tDepth: { value: null },
    uProjectionInverse: { value: new Matrix4() },
    uMatrixWorld: { value: new Matrix4() },
  }

  constructor (scene, camera) {
    this.scene = scene
    this.camera = camera

    this.renderer = new WebGLRenderer()
    this.renderer.setClearColor(0x252428)
    this.renderer.setSize(this.width, this.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.setPixelRatio(window.devicePixelRatio / 2)
    this.renderer.toneMapping = CineonToneMapping
    this.renderer.toneMappingExposure = 1

    this.target = new WebGLRenderTarget(this.width, this.height)
    this.target.texture.format = RGBFormat
    this.target.texture.minFilter = LinearFilter
    this.target.texture.magFilter = LinearFilter
    this.target.texture.generateMipmaps = false
    this.target.stencilBuffer = false
    this.target.depthBuffer = true
    this.target.depthTexture = new DepthTexture()
    this.target.depthTexture.format = DepthFormat
    this.target.depthTexture.type = UnsignedShortType

    this.uniforms.tDepth.value = this.target.depthTexture

    this.composer = new EffectComposer(this.renderer)
  }

  init (el) {
    const renderPass = new RenderPass(this.scene, this.camera)
    const saoPass = new SAOPass(this.scene, this.camera, true, true, new Vector2(1 / (this.width * pixelRatio), 1 / (this.height * pixelRatio)))
    const fxaaPass = new ShaderPass(FXAAShader)
    const filmPass = new FilmPass(.2, .2, 500, false)
    const lensDistortionPass = new LensDistortionPass(1.0)

    const pixelRatio = this.renderer.getPixelRatio()
    fxaaPass.material.uniforms.resolution.value.x = 1 / (this.width * pixelRatio)
    fxaaPass.material.uniforms.resolution.value.y = 1 / (this.height * pixelRatio)

    saoPass.params.saoIntensity = .001
    saoPass.params.saoKernelSize = 100
    saoPass.params.saoScale = 1

    this.composer.addPass(renderPass)
    // this.composer.addPass(saoPass)
    this.composer.addPass(fxaaPass)
    this.composer.addPass(filmPass)
    this.composer.addPass(lensDistortionPass)

    this.renderer.setAnimationLoop(this.gameLoop)

    subscribe(RESIZE, this.onResize)
    publish(INIT_RENDERER)

    el.appendChild(this.renderer.domElement)
  }

  gameLoop = () => {
    this.deltaTime.value += this.clock.getDelta()

    const deltaTime = this.deltaTime.value

    if (deltaTime > TIME_INTERVAL) {
      publish(UPDATE, { deltaTime })

      this.renderer.setRenderTarget(this.target)
      this.renderer.render(this.scene, this.camera)

      this.composer.render(deltaTime)

      publish(DRAW)

      this.time.value += deltaTime
      this.deltaTime.value %= TIME_INTERVAL
    }
  }

  destroy () {
    this.renderer.setAnimationLoop(null)

    unsubscribe(RESIZE, this.onResize)
  }

  onResize = ({ width, height }) => {
    this.width = width
    this.height = height
    this.target.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio / 2)
    this.renderer.setSize(width, height)
  }
}
