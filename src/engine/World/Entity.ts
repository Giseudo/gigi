import { Object3D } from 'three'
import { IStartable, IDestroyable, IActivatable, IUpdatable } from '../interfaces'
import { UpdatePayload } from '../payloads'
import { publish } from '../Messenger'
import { ADD_ENTITY } from './events'
import Component from './Component'

/**
 * Game object.
 * @extends {THREE.Object3D}
 */
class Entity extends Object3D implements IStartable, IDestroyable, IActivatable, IUpdatable {
  components: Array<Component>
  isEnabled: boolean

  /**
   * Creates a new Entity object.
   */
  constructor() {
    super()

    /** Whether the entity is active or not */
    this.isEnabled = false

    /** The active components list */
    this.components = []
  }

  /**
   * Initialize an Entity and its components, then adds it to the world. If
   * no parent object if given it will be added to the scene graph root.
   * @param {Entity} entity The entity to instantiate
   * @param {Object3D} parent The parent object
   * @returns {Promise<Entity>}
   */
  public static async Instantiate(entity: Entity, parent: Object3D): Promise<Entity> {
    await entity.start()

    entity.components.forEach((c: Component) => c.start())
    entity.publish('started')

    publish(ADD_ENTITY, { entity, parent })

    return entity
  }

  /**
   * Initializes the entity. Load models, textures, materials.
   * Subscribe to events.
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    //
  }

  /**
   * Destroys the entity. Dispose data. Unsubscribe from events.
   */
  public destroy (): void {
    this.publish('destroyed', { entity: this })
  } 

  /**
   * Updates the entity and all active components.
   * @param {UpdatePayload} payload Time payload object
   */
  public update(payload: UpdatePayload): void {
    this.components.forEach(component =>
      component.isEnabled && component.update(payload)
    )
  }

  /**
   * Get a component from class type.
   * @param {constructor} type The component class
   * @returns {Component}
   */
  public getComponent<T extends Component>(type: (new () => T)): T {
    const component = this.components.find(c => c instanceof type) as T
    
    if (!component)
      throw new Error(`Could not find component of type ${type.name}`)

    return component
  }

  /**
   * Attaches a component to the entity. Cannot add two components from
   * the same type.
   * @param {Component} component The component instance
   * @returns {Component}
   */
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

  /**
   * Removes a component from the entity of class type.
   * @param {constructor} type The component class
   */
  public removeComponent<T extends Component>(type: (new () => T)): void {
    const index = this.components.findIndex(c => c instanceof type)

    if (index < 0)
      throw new Error(`Entity has no component of type ${type.name}`)

    const component = this.components[index]
    component.destroy()
    this.components.splice(index, 1)
  }

  /**
   * Enables the entity.
   */
  public enable() {
    this.visible = true
    this.isEnabled = true
    this.publish('enabled', { entity: this })
  }

  /**
   * Disables the entity.
   */
  public disable() {
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

export default Entity
