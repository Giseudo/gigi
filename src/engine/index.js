import GRenderer from '@GRenderer'
import GCamera from '@GCamera'
import GWorld from '@GWorld'
import GInput from '@GInput'
import GScene from '@GScene'
import GResources from '@GResources'
import GNavMesh from '@GNavMesh'
import GNetwork from '@GNetwork'

export const resources = new GResources()
export const camera = new GCamera()
export const scene = new GScene()
export const world = new GWorld()
export const renderer = new GRenderer(scene, camera.mainCamera, world)
export const navMesh = new GNavMesh()
export const input = new GInput()
export const network = new GNetwork()

export default class GEngine {
  resources
  camera
  scene
  world
  renderer
  navMesh
  input
  network

  constructor () {
    this.resources = resources
    this.camera = camera
    this.scene = scene
    this.world = world
    this.renderer = renderer
    this.navMesh = navMesh
    this.input = input
  }

  async init (el) {
    this.renderer.init(el)
    this.camera.init()
    this.input.init()
    this.world.init()
    await this.navMesh.init()
  }

  destroy () {
    this.renderer.destroy()
    this.camera.destroy()
    this.input.destroy()
    this.navMesh.destroy()
    this.world.destroy()
  }
}
