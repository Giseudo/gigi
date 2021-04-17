import { Scene } from 'three'
import { EntityEventPayload, UpdatePayload } from './types'
import Entity from './Entity'

export default class World extends Scene {
  /**
   * Adds entity to scene.
   * @param entity The entity to be added
   * @returns Promise A promise resolved after the entity is loaded
   */
  add(entity: Entity): this {
    entity.subscribe('onActivate', this.onAddToScene)
    entity.subscribe('onDisable', this.onRemoveFromScene)
    entity.subscribe('onDestroy', this.onEntityDestroyed)

    entity.start()
      .then(() => {
        entity.components.forEach(c => c.start)
        entity.publish('onStart')
        entity.activate()
      })

    return this
  }

  /**
   * Adds object to scene
   * @param payload Entity event data
   * @returns void
   */
  private onAddToScene = ({ entity }: EntityEventPayload): void => {
    super.add(entity)
  }

  /**
   * Removes object from scene
   * @param payload Entity event data
   * @returns void
   */
  private onRemoveFromScene = ({ entity }: EntityEventPayload): void => {
    super.remove(entity)
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

    entity.components.forEach(c => c.destroy)

    entity.traverse((node: any) => {
      if (node.isMesh) {
        node.geometry?.dispose()
        node.material?.dispose()
      }
    })

    entity.remove()
  }

  /**
   * Updates all the active entities
   * @param payload Update event data
   * @returns void
   */
  update(payload: UpdatePayload) {
    const entities = this.children as Array<Entity>

    entities.forEach(entity => entity.update && entity.update(payload))
  }
}
