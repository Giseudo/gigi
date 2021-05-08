import { Scene, Object3D } from 'three'
import { EntityPayload, UpdatePayload, Object3DPayload } from '../payloads'
import { subscribe, unsubscribe } from '../Messenger'
import { ADD_ENTITY, ADD_OBJECT, REMOVE_OBJECT } from '../events'
import Entity from './Entity'
import Component from './Component'

/**
 * Entities manager.
 * @class
 * @extends {THREE.Scene}
 * @memberof GEngine
 */
class World extends Scene {
  public entities: Array<Entity>

  /**
   * Creates a new World object.
   */
  constructor () {
    super()

    /**
     * List of entities.
    * @type Array<Entity>
    */
    this.entities = []
  }

  /**
   * Initializes the world, setup dependencies.
   * Subscribe to events.
   */
  public init(): void {
    subscribe(ADD_ENTITY, this.onAddEntity)
    subscribe(ADD_OBJECT, this.onAddObject)
    subscribe(REMOVE_OBJECT, this.onRemoveObject)

    this.dispatchEvent({ type: 'started' })
  }

  /**
   * Destroys the world and every entitty.
   * Unsubscribe from events.
   */
  public destroy(): void {
    unsubscribe(ADD_ENTITY, this.onAddEntity)
    unsubscribe(ADD_OBJECT, this.onAddObject)
    unsubscribe(REMOVE_OBJECT, this.onRemoveObject)

    this.entities.forEach(entity => entity.destroy())
  }

  /**
   * Add entity to the world.
   * @param {Entity} entity The entity
   * @param {Object3D} [parent] The parent object
   * @returns {Promise<Entity>}
   */
  public async addEntity (entity: Entity, parent?: Object3D): Promise<Entity> {
    this.attachEntity(entity, parent)

    await entity.start()

    return entity
  }

  /**
   * Remove entity from the world.
   * @param {Entity} entity The entity
   */
  public removeEntity (entity: Entity): void {
    this.destroyEntity(entity)
  }

  /**
   * Remove entity from the world.
   * @param {Entity} entity The entity
   * @deprecated you should use removeEntity instead.
   */
  public destroyEntity (entity: Entity): void {
    const index = this.entities.indexOf(entity)

    if (index < 0) return

    this.entities.splice(index, 1)
    entity.disable()
    entity.components.forEach((c: Component) => c.destroy())

    entity.traverse((node: any) => {
      if (node.isMesh) {
        node.geometry?.dispose()
        node.material?.dispose()
      }
    })

    entity.remove()
    super.remove(entity)
  }

  /**
   * Updates all the active entities.
   * @param {UpdatePayload} payload Update event data
   */
  public update(payload: UpdatePayload): void {
    const entities = this.entities

    entities.forEach(entity => entity.isEnabled && entity.update(payload))
  }

  /**
   * Adds entity to entities list. Attaches it to the parent or to the
   * scene if no parent is given.
   * @param {Entity} entity The entity
   * @param {Object3D} parent The parent object
   * @private
   */
  private attachEntity(entity: Entity, parent?: Object3D): void {
    this.entities.push(entity)
    entity.subscribe('destroyed', this.onEntityDestroy)

    if (!parent) super.add(entity)
    if (parent) parent.add(entity)
  }

  private onAddObject = ({ object }: Object3DPayload): void => {
    this.add(object)
  }

  private onRemoveObject = ({ object }: Object3DPayload): void => {
    this.remove(object) }

  private onAddEntity = ({ entity, parent }: EntityPayload): void => {
    this.attachEntity(entity, parent)
  }

  private onEntityDestroy = ({ entity }: EntityPayload): void => {
    this.removeEntity(entity)
  }
}

export default World
