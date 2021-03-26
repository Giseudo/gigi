import { reactive, readonly } from 'vue'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { TextureLoader,
  Matrix4,
  WebGLRenderTarget,
  LinearFilter,
  NearestFilter,
  RGBFormat,
  DepthFormat,
  DepthTexture,
  UnsignedShortType,
  Vector2,
  WebGLRenderer,
  Clock,
  EventDispatcher,
  CineonToneMapping,
  OrthographicCamera,
  Scene,
} from 'three'
import { START, UPDATE, DRAW } from './types'

const TIME_INTERVAL = 1 / 60

export default class GRenderer {
  scene
  camera
  target
  renderer
  composer
  events = new EventDispatcher()
  clock = new Clock()
  width = window.innerWidth
  height = window.innerHeight
  time = 0.0
  deltaTime = 0.0

  uniforms = {
    depthTexture: { value: null },
    uProjectionInverse: { value: new Matrix4() },
    uMatrixWorld: { value: new Matrix4() },
    uResolution: { value: new Vector2() }
  }

  constructor (scene, camera) {
    this.scene = scene
    this.camera = camera
    this.renderer = new WebGLRenderer()
    this.composer = new EffectComposer(this.renderer)
    this.target = new WebGLRenderTarget(this.width, this.height)
  }

  init (el) {
    this.renderer.setClearColor(0x252428)
    this.renderer.setSize(this.width, this.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.toneMapping = CineonToneMapping
    this.renderer.toneMappingExposure = 1

    this.target.texture.format = RGBFormat
    this.target.texture.minFilter = LinearFilter
    this.target.texture.magFilter = LinearFilter
    this.target.texture.generateMipmaps = false
    this.target.stencilBuffer = false
    this.target.depthBuffer = true
    this.target.depthTexture = new DepthTexture()
    this.target.depthTexture.format = DepthFormat
    this.target.depthTexture.type = UnsignedShortType

    this.composer.addPass(new RenderPass(this.scene, this.camera))

    this.renderer.setAnimationLoop(() => this.gameLoop())

    this.publish(START)

    el.appendChild(this.renderer.domElement)
  }

  setSize (width, height) {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height)
    this.target.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
  }

  gameLoop () {
    this.deltaTime += this.clock.getDelta()

    const deltaTime = this.deltaTime

    if (deltaTime > TIME_INTERVAL) {
      this.publish(UPDATE, { deltaTime })

      this.renderer.setRenderTarget(this.target)
      this.renderer.render(this.scene, this.camera)

      this.composer.render(deltaTime)

      this.publish(DRAW)

      this.time += this.deltaTime.value
      this.deltaTime %= TIME_INTERVAL
    }
  }

  destroy () {
    this.renderer.setAnimationLoop(null)
  }

  publish (type, data) {
    this.events.dispatchEvent({ type, ...(data ? data : {}) })
  }

  subscribe (topic, callback) {
    this.events.addEventListener(topic, callback)
  }

  unsubscribe (topic, callback) {
    this.events.removeEventListener(topic, callback)
  }
}
