import { reactive, readonly } from 'vue'
import { PerspectiveCamera } from 'three'
import renderer from '@/engine/renderer'

const state = reactive({ })

export const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  .1,
  1000
)

export default {
  mainCamera: camera,
  state: readonly(state),

  init: () => {
  }
}
