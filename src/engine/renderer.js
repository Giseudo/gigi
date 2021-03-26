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
import * as types from './types'

const TIME_INTERVAL = 1 / 60

export default class GRenderer {
  scene
  camera
  target
  renderer
  composer
  events = new EventDispatcher()
  clock = new Clock()

  state = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
    time: new FloatNode(0.0),
    deltaTime: new FloatNode(0.0),
    depthTexture: {
      value: null
    },
    uProjectionInverse: {
      type: 'm4',
      value: new Matrix4()
    },
    uMatrixWorld: {
      type: 'm4',
      value: new Matrix4()
    },
    uResolution: {
      type: 'v2',
      value: new Vector2()
    }
  })

  constructor (el, scene, camera) {
    this.scene = scene
    this.camera = camera

    this.init(el)
    this.publish(types.START)
  }

  init (el) {
    this.renderer = new WebGLRenderer({ antialias: false })
    this.renderer.setClearColor(0x252428)
    this.renderer.setSize(this.state.width, this.state.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.toneMapping = CineonToneMapping
    this.renderer.toneMappingExposure = 1

    this.composer = new EffectComposer(this.renderer)

    this.target = new WebGLRenderTarget(this.state.width, this.state.height)
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

    el.appendChild(this.renderer.domElement)
  }

  setSize (width, height) {
    this.state.width = width
    this.state.height = height
    this.renderer.setSize(width, height)
    this.target.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
  }

  gameLoop () {
    this.state.deltaTime.value += this.clock.getDelta()

    const deltaTime = this.state.deltaTime.value

    if (deltaTime > TIME_INTERVAL) {
      this.publish(types.UPDATE, { deltaTime })

      this.renderer.setRenderTarget(this.target)
      this.renderer.render(this.scene, this.camera)

      this.composer.render(deltaTime)

      this.publish(types.DRAW)

      this.state.time.value += this.state.deltaTime.value
      this.state.deltaTime.value %= TIME_INTERVAL
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
