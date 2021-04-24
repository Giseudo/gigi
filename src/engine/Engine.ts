import { World, Camera, Renderer, Input, NavMesh, Debug, publish } from './'
import { START } from './events'
import Network from './Network'

export default class Engine {
  renderer: Renderer
  camera: Camera = new Camera()
  world: World = new World()
  input: Input = new Input()
  network: Network = new Network()
  debug: Debug = new Debug()
  navMesh: NavMesh = new NavMesh()

  constructor() {
    this.renderer = new Renderer(this.world, this.camera)
  }

  async init(element: HTMLElement) {
    this.camera.init()
    this.renderer.init(element)
    this.input.init()
    this.network.init()
    this.world.init()
    await this.navMesh.init()

    publish(START)
  }

  destroy() {
    this.camera.destroy()
    this.renderer.destroy()
    this.input.destroy()
    this.navMesh.destroy()
    this.network.destroy()
    this.world.destroy()
  }
}
