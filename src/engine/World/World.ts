import { Scene, Object3D } from 'three'
import { EntityPayload, UpdatePayload, Object3DPayload } from '../payloads'
import { subscribe, unsubscribe } from '../Messenger'
import { ADD_ENTITY, ADD_OBJECT, REMOVE_OBJECT } from '../events'
import Entity from './Entity'
import Component from './Component'

/**
 * World Class
 *
 * @extends {THREE.Scene}
 */
class World extends Scene {
  public entities: Array<Entity>

  /**
   * Creates a World object.
   */
  constructor () {
    super()

    /**
    * The entities list.
    */
    this.entities = []
  }

  /**
   * Initializes the world, setup dependencies.
   * Subscribe to events.
   *
   * @returns {void}
   */
  public init(): void {
    subscribe(ADD_ENTITY, this.onAddEntity)
    subscribe(ADD_OBJECT, this.onAddObject)
    subscribe(REMOVE_OBJECT, this.onRemoveObject)
  }

  /**
   * Destroys the world and every entitty.
   * Unsubscribe from events.
   *
   * @returns {void}
   */
  public destroy(): void {
    unsubscribe(ADD_ENTITY, this.onAddEntity)
    unsubscribe(ADD_OBJECT, this.onAddObject)
    unsubscribe(REMOVE_OBJECT, this.onRemoveObject)

    this.entities.forEach(entity => entity.destroy())
  }

  /**
   * Add entity to the world.
   *
   * @param {Entity} entity The entity
   * @param {Object3D} [parent] The parent object
   * @returns {Entity}
   */
  public addEntity (entity: Entity, parent?: Object3D): Entity {
    this.entities.push(entity)
    entity.subscribe('destroyed', this.onEntityDestroy)

    if (parent) parent.attach(entity)
    else super.add(entity)

    entity.enable()

    return entity
  }

  /**
   * Remove entity from the world.
   *
   * @param {Entity} entity The entity
   * @returns {void}
   */
  public removeEntity (entity: Entity): void {
    this.destroyEntity(entity)
  }

  /**
   * Remove entity from the world.
   *
   * @deprecated you should use removeEntity.
   * @param {Entity} entity The entity
   * @returns {void}
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
   *
   * @param {UpdatePayload} payload Update event data
   * @returns {void}
   */
  public update(payload: UpdatePayload): void {
    const entities = this.entities

    entities.forEach(entity => entity.isEnabled && entity.update(payload))
  }

  private onAddObject = ({ object }: Object3DPayload): void => {
    this.add(object)
  }

  private onRemoveObject = ({ object }: Object3DPayload): void => {
    this.remove(object)
  }

  private onAddEntity = ({ entity, parent }: EntityPayload): void => {
    this.addEntity(entity, parent)
  }

  private onEntityDestroy = ({ entity }: EntityPayload): void => {
    this.removeEntity(entity)
  }
}

export default World
