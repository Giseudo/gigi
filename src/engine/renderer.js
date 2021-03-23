import { reactive, readonly } from 'vue'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { camera } from '@/engine/camera'
import { scene } from '@/engine/scene'
import { WebGLRenderer, Clock, EventDispatcher } from 'three'
import * as types from './types'

const state = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  time: new FloatNode(0.0),
  deltaTime: new FloatNode(0.0)
})

const Events = new EventDispatcher()

export const renderer = new WebGLRenderer({ antialias: true })
export const composer = new EffectComposer(renderer)
export const clock = new Clock()
const interval = 1 / 60

const gameLoop = () => {
  state.deltaTime.value += clock.getDelta()

  if (state.deltaTime.value > interval) {
    Events.dispatchEvent({ type: types.UPDATE, deltaTime: state.deltaTime.value })
    Events.dispatchEvent({ type: types.DRAW })
    composer.render()

    state.time.value += state.deltaTime.value
    state.deltaTime.value %= interval
  }
}

export default {
  state: readonly(state),

  init: (el, options) => {
    renderer.setClearColor(0x252428)
    renderer.setSize(state.width, state.height)
    renderer.shadowMap.enabled = true
    renderer.setPixelRatio(.5)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // const bloomPass = new BloomPass()
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
