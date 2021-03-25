import { reactive, readonly } from 'vue'
import { PerspectiveCamera, OrthographicCamera } from 'three'
import renderer from '@/engine/renderer'

const state = reactive({ })

export const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  .1,
  1000
)

/*export const camera = new OrthographicCamera(
  window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000
)*/

export default {
  mainCamera: camera,
  state: readonly(state),

  init: () => {
  }
}
