import { reactive, readonly } from 'vue'
import { PerspectiveCamera, OrthographicCamera } from 'three'
import renderer from '@/engine/renderer'

const state = reactive({ })

export const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  10.,
  1000
)

export const orthoCam = new OrthographicCamera(
  window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000
)

export default {
  mainCamera: camera,
  state: readonly(state),

  init: () => {
  }
}
