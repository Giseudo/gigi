import { World, Camera, Renderer, Input, NavMesh, publish, START } from './'

export default class Engine {
  renderer: Renderer
  camera: Camera = new Camera()
  world: World = new World()
  input: Input = new Input()
  navMesh: NavMesh = new NavMesh()

  constructor() {
    this.renderer = new Renderer(this.world, this.camera)
  }

  async init(element: HTMLElement) {
    this.camera.init()
    this.renderer.init(element)
    this.input.init()
    await this.navMesh.init()

    publish(START)
  }

  destroy() {
    this.camera.destroy()
    this.renderer.destroy()
    this.input.destroy()
    this.navMesh.destroy()
  }
}
