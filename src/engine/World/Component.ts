import { EventDispatcher } from 'three'
import { UpdatePayload } from '../payloads'
import { IStartable, IDestroyable, IActivatable, IUpdatable } from '../interfaces'
import Entity from './Entity'

/**
 * Game component class.
 * @class
 * @extends THREE.EventDispatcher
 * @memberof GEngine
 */
class Component extends EventDispatcher implements IStartable, IDestroyable, IActivatable, IUpdatable {
  public entity: Entity
  public isEnabled: boolean

  /**
   * Creates a new game Component object.
   */
  constructor(entity: Entity) {
    super()

    /**
     * The entity which the component is attached to.
     * @type Entity
     */
    this.entity = entity

    /**
     * Whether the component is active or not.
     * @type boolean
     */
    this.isEnabled = false
  }

  /**
   * Initializes the component, subscribes to events, and publishes
   * "started" event.
   * @returns {Promise<Void>}
   */
  async start(): Promise<void> {
    this.enable()

    await this.onStart()

    /**
     * Fired when the component is initialized.
     * @event GEngine.Component#started
     */
    this.publish('started')
  }

  /**
   * Destroys the component, unsubscribes from events, and publishes
   * "destroyed" event.
   */
  public destroy() {
    this.disable()

    this.onDestroy()

    /**
     * Fired when the component is destroyed.
     * @event GEngine.Component#destroyed
     */
    this.publish('destroyed')
  }

  /**
   * Game loop update callback.
   * @param {UpdatePayload} payload The time payload
   */
  public update(_: UpdatePayload): void { }

  /**
   * Enables the component.
   */
  public enable(): void {
    this.isEnabled = true

    this.onEnable()

    /**
     * Fired when the component is enabled.
     * @event GEngine.Component#enabled
     */
    this.publish('enabled')
  }

  /**
   * Enables the component.
   */
  public disable(): void {
    this.isEnabled = false

    this.onDisable()

    /**
     * Fired when the component is disabled.
     * @event GEngine.Component#disabled
     */
    this.publish('disabled')
  }

  /**
   * Called when the component starts. This callback function should
   * load any resource needed by the component, as it is a good place
   * to subscribe to events.
   * @returns {Promise<void>}
   * @protected
   */
  protected async onStart(): Promise<void> { }

  /**
   * Called when the component is destroyed.
   * @protected
   */
  protected onDestroy(): void { }

  /**
   * This callback is called when the component is enabled.
   * @protected
   */
  protected onEnable(): void { }

  /**
   * This callback is called when the component is disabled.
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

export default Component
