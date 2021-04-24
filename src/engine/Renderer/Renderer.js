import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { LensDistortionPass } from './passes/LensDistortionPass'
import { BloomPass } from './passes/BloomPass'
import {
  WebGLRenderer,
  WebGLRenderTarget,
  Clock,
  NearestFilter,
  RGBFormat,
  DepthFormat,
  DepthTexture,
  UnsignedShortType,
  CineonToneMapping,
  Matrix4
} from 'three'
import { UPDATE, DRAW, RESIZE, INIT_RENDERER, WINDOW_FOCUS, WINDOW_BLUR } from '../events'
import { publish } from '@GMessenger'

const TIME_INTERVAL = 1 / 30

export default class Renderer {
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
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(this.width, this.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.setPixelRatio(window.devicePixelRatio / 2)
    this.renderer.toneMapping = CineonToneMapping
    this.renderer.toneMappingExposure = 1

    const pixelRatio = this.renderer.getPixelRatio() / 2

    this.target = new WebGLRenderTarget(this.width * pixelRatio, this.height * pixelRatio)
    this.target.texture.format = RGBFormat
    this.target.texture.minFilter = NearestFilter
    this.target.texture.magFilter = NearestFilter
    this.target.texture.generateMipmaps = false
    this.target.stencilBuffer = false
    this.target.depthBuffer = true
    this.target.depthTexture = new DepthTexture()
    this.target.depthTexture.format = DepthFormat
    this.target.depthTexture.type = UnsignedShortType

    this.uniforms.tDepth.value = this.target.depthTexture

    this.composer = new EffectComposer(this.renderer, this.target)
  }

  init (el) {
    const renderPass = new RenderPass(this.scene, this.camera)
    const bloomPass = new BloomPass(this.scene, this.camera, this.renderer)
    const lensDistortionPass = new LensDistortionPass(1.0)

    this.composer.addPass(renderPass)
    this.composer.addPass(bloomPass)
    this.composer.addPass(lensDistortionPass)

    this.renderer.setAnimationLoop(this.gameLoop)

    publish(INIT_RENDERER)

    el.appendChild(this.renderer.domElement)

    window.addEventListener('resize', this.onResize)
    window.addEventListener('focus', this.onWindowFocus)
    window.addEventListener('blur', this.onWindowBlur)
  }

  gameLoop = () => {
    this.deltaTime.value += Math.min(this.clock.getDelta(), .1)

    const deltaTime = this.deltaTime.value

    if (deltaTime > TIME_INTERVAL) {
      publish(UPDATE, { deltaTime })

      this.composer.render(deltaTime)
      this.scene.update({ deltaTime })

      publish(DRAW)

      this.time.value += deltaTime
      this.deltaTime.value %= TIME_INTERVAL
    }
  }

  destroy () {
    this.renderer.setAnimationLoop(null)

    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('focus', this.onWindowFocus)
    window.removeEventListener('blur', this.onWindowBlur)
  }

  onResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    this.width = width
    this.height = height

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio / 2)

    const pixelRatio = this.renderer.getPixelRatio() / 2
    this.composer.setSize(width * pixelRatio, height * pixelRatio)

    publish(RESIZE, { width, height })
  }

  onWindowFocus = () => {
    publish(WINDOW_FOCUS)
  }

  onWindowBlur = () => {
    publish(WINDOW_BLUR)
  }
}
