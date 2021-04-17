import { Object3D } from 'three'
import { UpdatePayload, IStartable, IDestroyable, IActivable, IDisableable, IUpdatable } from './types'
import Messenger from './Messenger'
import Component from './Component'

export default class Entity extends Messenger implements IStartable, IDestroyable, IActivable, IDisableable, IUpdatable {
  active: boolean = false
  object?: Object3D
  components: Array<Component> = []

  async start(): Promise<void> { }

  destroy(): void {
    this.disable()
    this.publish('onDestroy', { entity: this })
  }

  public update(payload: UpdatePayload): void {
    this.components.forEach(component => component.active && component.update(payload))
  }

  public getComponent<T extends Component>(type: (new () => T)): T {
    const component = this.components.find(c => c instanceof type) as T
    
    if (!component)
      throw new Error(`Could not find component of type ${type}`)

    return component
  }

  public addComponent<T extends Component>(component: T): T {
    const type: string = component.constructor.name
    const index = this.components.findIndex(c => c.constructor.name === type)

    if (index >= 0)
      throw new Error(`Component of type ${type} already extists`)

    component.setEntity(this)
    component.start()
    this.components.push(component)

    return component
  }

  // public removeComponent<T extends Component>(type: (new () => T)): void { }

  activate() {
    this.active = true
    this.publish('onActivate', { entity: this })
  }

  disable() {
    this.active = false
    this.publish('onDisable', { entity: this })
  }
}
