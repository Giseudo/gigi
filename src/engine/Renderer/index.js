import { reactive, readonly } from 'vue'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { LensDistortionPass } from './passes/LensDistortionPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { BloomPass } from './passes/BloomPass'
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

const TIME_INTERVAL = 1 / 24

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
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.toneMapping = CineonToneMapping
    this.renderer.toneMappingExposure = 1

    const pixelRatio = .25 * window.devicePixelRatio

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
    const filmPass = new FilmPass(.1, .2, 400, false)
    const lensDistortionPass = new LensDistortionPass(1.0)

    this.composer.addPass(renderPass)
    this.composer.addPass(bloomPass)
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
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    const pixelRatio = .2 * window.devicePixelRatio
    this.composer.setSize(width * pixelRatio, height * pixelRatio)
  }
}
