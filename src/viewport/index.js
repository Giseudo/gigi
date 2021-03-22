import { reactive, readonly } from 'vue'
import extensions from './extensions'
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Clock,
} from 'three'

import * as Nodes from 'three/examples/jsm/nodes/Nodes'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'

const state = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  time: new Nodes.FloatNode(0.0),
  deltaTime: new Nodes.FloatNode(0.0)
})

export const scene = new Scene()
export const camera = new PerspectiveCamera(75, state.width / state.height, .1, 1000)
export const renderer = new WebGLRenderer({ antialias: false })
export const composer = new EffectComposer(renderer)
export const clock = new Clock()

const update = (callback) => {
  state.deltaTime.value = clock.getDelta()
  state.time.value += state.deltaTime.value

  callback(state.deltaTime.value)
}

const draw = (callback) => {
  composer.render()
  callback()
}

export default {
  scene,
  camera,
  renderer,

  state: readonly(state),

  init: ({ el }) => {
    renderer.setClearColor(0x252428)
    renderer.setSize(state.width, state.height)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new BloomPass(1, 25, 4.0, 256)
    // composer.addPass(bloomPass)

    el.appendChild(renderer.domElement)
    extensions()
  },

  animate: (updateCallback, drawCallback) => {
    renderer.setAnimationLoop(() => {
      update(updateCallback)
      draw(drawCallback)

      renderer.domElement.dispatchEvent(
        new CustomEvent('update', {
          detail: {
            deltaTime: state.deltaTime.value
          }
        })
      )
    })
  },

  addToScene: obj => {
    state.objects.push(obj)
    scene.add(obj)
  },

  moveCamera: (direction, distance) => {
    camera.translateOnAxis(direction, distance)
  },

  subscribe: (name, callback) => {
    renderer.domElement.addEventListener(name, callback)
  },

  unsubscribe: (name, callback) => {
    renderer.domElement.removeEventListener(name, callback)
  }
}
