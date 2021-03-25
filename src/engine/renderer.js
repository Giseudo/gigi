import { reactive, readonly } from 'vue'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { camera } from '@/engine/camera'
import { scene } from '@/engine/scene'
import { TextureLoader, Matrix4, WebGLRenderTarget, LinearFilter, NearestFilter, RGBFormat, DepthFormat, DepthTexture, UnsignedShortType, Vector2, Vector3, WebGLRenderer, Clock, EventDispatcher, CineonToneMapping } from 'three'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import * as types from './types'

const state = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  time: new FloatNode(0.0),
  deltaTime: new FloatNode(0.0),
  depthTexture: {
    value: null
  },
  viewMatrixInverse: {
    type: 'm4',
    value: camera.matrixWorldInverse
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


const Events = new EventDispatcher()

export const renderer = new WebGLRenderer({ antialias: true })
renderer.autoClear = false
renderer.setClearColor(0x252428)
renderer.setSize(state.width, state.height)
renderer.shadowMap.enabled = true
renderer.setPixelRatio(window.devicePixelRatio)
renderer.toneMapping = CineonToneMapping
renderer.toneMappingExposure = 1

// render texture 
const target = new WebGLRenderTarget(state.width, state.width)
target.texture.format = RGBFormat
target.texture.minFilter = LinearFilter
target.texture.magFilter = LinearFilter
target.texture.generateMipmaps = false
target.stencilBuffer = true
target.depthBuffer = true
target.depthTexture = new DepthTexture()
target.depthTexture.format = DepthFormat
target.depthTexture.type = UnsignedShortType

export const composer = new EffectComposer(renderer)

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

// const ssaoPass = new SSAOPass(scene, camera, state.width, state.height)
// ssaoPass.kernelRadius = 4
// composer.addPass(ssaoPass)

const depthShader = {
  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",
    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"

  ].join( "\n" ),
  fragmentShader: [

    "#include <packing>",

    "varying vec2 vUv;",
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D tDepth;",
    "uniform float cameraNear;",
    "uniform float cameraFar;",

    `
    uniform mat4 uProjectionInverse;
    uniform mat4 uViewInverse;
float frac(float v) {
  return v - floor(v);
}
    `,

    "float readDepth( sampler2D depthSampler, vec2 coord ) {",
      "float fragCoordZ = texture2D( depthSampler, coord ).x;",
      "float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );",
      "return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );",
    "}",

    "void main() {",         
    "float depth = readDepth( tDepth, vUv );",
    `
      float normalizedDepth = unpackRGBAToDepth(texture2D(tDepth, vUv));
    `,
    "gl_FragColor.rgb = 1.0 - vec3(depth);",
    "gl_FragColor.a = 1.0;",
    //"gl_FragColor = texture2D( tDiffuse, vUv );",
    "}"

  ].join( "\n" ),  
  uniforms: {
    cameraNear: { value: 0 },
    cameraFar: { value: 0 },
    tDiffuse: { value: null },
    tDepth: { value: null }
  }
};

var depthPass = new ShaderPass(depthShader)
depthPass.uniforms.cameraNear.value = camera.near
depthPass.uniforms.cameraFar.value = camera.far
depthPass.uniforms.tDepth.value = target.depthTexture
// composer.addPass(depthPass)

export const clock = new Clock()
const interval = 1 / 60

const gameLoop = () => {
  state.deltaTime.value += clock.getDelta()

  if (state.deltaTime.value > interval) {
    renderer.clear()
    Events.dispatchEvent({ type: types.UPDATE, deltaTime: state.deltaTime.value })

    state.uProjectionInverse.value.copy(camera.projectionMatrixInverse)
    state.uMatrixWorld.value.copy(camera.matrixWorld)

    renderer.setRenderTarget(target)
    renderer.render(scene, camera)

    Events.dispatchEvent({ type: types.DRAW })

    composer.render()

    // renderer.setRenderTarget(null)
    // renderer.render(scene, camera)

    state.time.value += state.deltaTime.value
    state.deltaTime.value %= interval
  }
}

export default {
  target, 

  state: readonly(state),

  init: (el, options) => {
    // state.depthTexture.value = target.depthTexture
    state.uResolution.value = new Vector2(state.width, state.height)

    /*const saoPass = new SAOPass(scene, camera, false, false)
    saoPass.params.saoBlur = true
    saoPass.params.saoBias = 1
    saoPass.params.saoBlurRadius = 5
    saoPass.params.saoIntensity = .08
    saoPass.params.saoKernelRadius = 50
    saoPass.params.saoScale = 10
    saoPass.resolution.set(512 * 20, 512 * 20)*/

    // const bloomPass = new BloomPass(2, 25 / 2, 4.0 / 2, 256)

    // composer.addPass(bloomPass)

    el.appendChild(renderer.domElement)

    Events.dispatchEvent({ type: types.START })
    renderer.setAnimationLoop(gameLoop)
  },

  destroy: () => {
    renderer.setAnimationLoop(null)
  },

  setSize: (width, height) => {
    state.width = width
    state.height = width

    renderer.setSize(width, height)
  },

  subscribe: (topic, callback) => {
    Events.addEventListener(topic, callback)
  },

  unsubscribe: (topic, callback) => {
    Events.removeEventListener(topic, callback)
  }
}
