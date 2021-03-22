import extensions from './extensions'
import { reactive, readonly } from 'vue'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { publish, subscribe, unsubscribe, clearAllSubscriptions, countSubscriptions } from 'pubsub-js'
import * as types from './types'
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  PCFSoftShadowMap,
  Clock,
} from 'three'

const state = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  time: new FloatNode(0.0),
  deltaTime: new FloatNode(0.0)
})

export const scene = new Scene()
export const camera = new PerspectiveCamera(75, state.width / state.height, .1, 1000)
export const renderer = new WebGLRenderer({ antialias: false })
export const composer = new EffectComposer(renderer)
export const clock = new Clock()

const initRenderer = (el) => {
  renderer.setClearColor(0x252428)
  renderer.setSize(state.width, state.height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  el.appendChild(renderer.domElement)
}

const update = () => {
  state.deltaTime.value = clock.getDelta()
  state.time.value += state.deltaTime.value

  publish(types.UPDATE, state.deltaTime.value)
}

const draw = () => {
  publish(types.DRAW)

  composer.render()
}

const gameLoop = () => {
  update()
  draw()
}

export default {
  scene,
  camera,
  renderer,

  state: readonly(state),

  init: ({ el }) => {
    extensions()
    initRenderer(el)
    publish(types.START)
    renderer.setAnimationLoop(gameLoop)
  },

  destroy: () => {
    renderer.setAnimationLoop(null)
    clearAllSubscriptions()
  },

  moveCamera: (direction, distance) => camera.translateOnAxis(direction, distance),
  subscribe: (topic, callback) => subscribe(topic, callback),
  unsubscribe: (topic, callback) => unsubscribe(topic, callback)
}
