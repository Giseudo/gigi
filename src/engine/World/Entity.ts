import { Object3D } from 'three'
import { IStartable, IDestroyable, IActivatable, IUpdatable } from '../interfaces'
import { UpdatePayload } from '../payloads'
import { publish } from '../Messenger'
import { ADD_ENTITY } from './events'
import Component from './Component'

/**
 * The main game object.
 * @class
 * @extends THREE.Object3D
 * @memberof GEngine
 */
class Entity extends Object3D implements IStartable, IDestroyable, IActivatable, IUpdatable {
  public components: Array<Component>
  public isEnabled: boolean

  /**
   * Creates a new Entity object.
   */
  constructor() {
    super()

    /**
     * The active components list.
     * @type Array<Component>
     */
    this.components = []

    /**
     * Whether the entity is active or not.
     * @type boolean
     */
    this.isEnabled = false
  }

  /**
   * Initializes an Entity. If no parent object if given it will
   * be added to the scene graph root.
   * @param {Entity} entity The entity to instantiate
   * @param {Object3D} parent The parent object
   * @returns {Promise<Entity>}
   */
  public static async Instantiate(entity: Entity, parent?: Object3D): Promise<Entity> {
    publish(ADD_ENTITY, { entity, parent })

    await entity.start()

    return entity
  }

  /**
   * Initializes the entity and its components.
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    for (let i = 0; i < this.components.length; i++) {
      const component: Component = this.components[i]
      await component.start()
    }

    await this.onStart()

    /**
     * Fired when the entity is initialized.
     * @event GEngine.Entity#started
     */
    this.publish('started')

    this.enable()
  }

  /**
   * Destroys the entity.
   */
  public destroy (): void {
    this.disable()

    this.onDestroy()

    /**
     * Fired when the entity is destroyed.
     * @event GEngine.Entity#destroyed
     * @param {EntityPayload} payload The event payload
     */
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

    component.start()
    this.components.push(component)

    return component
  }

  /**
   * Removes a component of given type from the entity.
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

    this.onEnable()

    /**
     * Fired when the component is enabled.
     * @event GEngine.Entity#enabled
     */
    this.publish('enabled', { entity: this })
  }

  /**
   * Disables the entity.
   */
  public disable() {
    this.visible = false
    this.isEnabled = false

    this.onDisable()

    /**
     * Fired when the component is disabled.
     * @event GEngine.Entity#disabled
     */
    this.publish('disabled', { entity: this })
  }

  /**
   * Called when the component starts loading. This callback function
   * should load any resource needed by the entity, as it is a good
   * place to subscribe to events.
   * @returns {Promise<void>}
   * @protected
   */
  protected async onStart(): Promise<void> { }

  /**
   * Called when the entity is destroyed.
   * @protected
   */
  protected onDestroy(): void { }

  /**
   * Called when the entity is enabled.
   * @protected
   */
  protected onEnable(): void { }

  /**
   * Called when the entity is disabled.
   * @protected
   */
  protected onDisable(): void { }

  /**
   * Subscribes callback function to the given event type.
   * @param {string} type The event type
   * @param {Function} callback The callback function
   */
  public subscribe (type: string, callback: (value: any) => void): void {
    this.addEventListener(type, callback)
  }

   /**
   * Unsubscribes callback function from the given event type.
   * @param {string} type The event type
   * @param {Function} callback The callback function
   */
  public unsubscribe(type: string, callback: (value: any) => void): void {
    this.removeEventListener(type, callback)
  }

   /**
   * Publishes an event with the given type, passing data as custom payload.
   * @param {string} type The event type
   * @param {Object} data The event payload data
   * @protected
   */
  protected publish (type: string, data?: any): void {
    this.dispatchEvent({ type, ...(data ? data : {}) })
  }
}

export default Entity
