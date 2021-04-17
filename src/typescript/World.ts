import { Scene } from 'three'
import { EntityEventPayload, UpdatePayload } from './types'
import Messenger from './Messenger'
import Entity from './Entity'

export default class World extends Messenger {
  scene: Scene
  entities: Array<Entity> = []

  constructor(scene: Scene) {
    super()
    this.scene = scene
  }

  /**
   * Adds entity to scene.
   * @param entity The entity to be added
   * @returns Promise A promise resolved after the entity is loaded
   */
  async addEntity(entity: Entity): Promise<Entity> {
    entity.subscribe('onActivate', this.onAddToScene)
    entity.subscribe('onDisable', this.onRemoveFromScene)
    entity.subscribe('onDestroy', this.onEntityDestroyed)

    await entity.start()

    return entity
  }

  /**
   * Adds object to scene
   * @param payload Entity event data
   * @returns void
   */
  private onAddToScene = ({ entity }: EntityEventPayload): void => {
    this.scene.add(entity)
    this.entities.push(entity)
  }

  /**
   * Removes object from scene
   * @param payload Entity event data
   * @returns void
   */
  private onRemoveFromScene = ({ entity }: EntityEventPayload): void => {
    this.removeEntity(entity)
  }

  /**
   * Unsubscribe from events when entity is destroyed
   * @param payload Entity event data
   * @returns void
   */
  private onEntityDestroyed = ({ entity }: EntityEventPayload): void => {
    entity.unsubscribe('onActivate', this.onAddToScene)
    entity.unsubscribe('onDisable', this.onRemoveFromScene)
    entity.unsubscribe('onDestroy', this.onEntityDestroyed)
  }

  /**
   * Removes entity from active list
   * @param entity Entity event data
   * @returns void
   */
  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity)

    if (index < 0) return
    if (entity.object) this.scene.remove(entity)

    this.entities.splice(index, 1)
  }

  /**
   * Updates all the active entities
   * @param payload Update event data
   * @returns void
   */
  update(payload: UpdatePayload) {
    this.entities.forEach(entity => entity.update(payload))
  }
}
