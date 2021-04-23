import { Object3D } from 'three'
import { UpdatePayload, IStartable, IDestroyable, IActivatable, IUpdatable } from '@/types'
import { publish } from '../'
import * as events from './events'
import Component from './Component'

export default class Entity extends Object3D implements IStartable, IDestroyable, IActivatable, IUpdatable {
  isEnabled: boolean = false
  components: Array<Component> = []

  static async Instantiate(entity: Entity, parent: Object3D): Promise<Entity> {
    await entity.start()

    entity.components.forEach((c: Component) => c.start())
    entity.publish('started')

    publish(events.ADD_ENTITY, { entity, parent })

    return entity
  }

  async start(): Promise<void> {}
  destroy = () => this.publish('destroyed', { entity: this })

  public update(payload: UpdatePayload): void {
    this.components.forEach(component =>
      component.isEnabled && component.update(payload)
    )
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

  // TODO
  // public removeComponent<T extends Component>(type: (new () => T)): void { }

  enable() {
    this.visible = true
    this.isEnabled = true
    this.publish('enabled', { entity: this })
  }

  disable() {
    this.visible = false
    this.isEnabled = false
    this.publish('disabled', { entity: this })
  }

  subscribe (type: string, callback: (value: any) => void): void {
    this.addEventListener(type, callback)
  }

  publish (type: string, data?: any): void {
    this.dispatchEvent({ type, ...(data ? data : {}) })
  }

  unsubscribe(type: string, callback: (value: any) => void): void {
    this.removeEventListener(type, callback)
  }
}
