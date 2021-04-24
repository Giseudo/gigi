import { Scene, Object3D } from 'three'
import { EntityPayload, UpdatePayload, subscribe } from '@/engine'
import { ADD_ENTITY } from './events'
import Entity from './Entity'
import Component from './Component'

export default class World extends Scene {
  entities: Array<Entity> = []

  init() {
    subscribe(ADD_ENTITY, this.onAddEntity)
  }

  private onAddEntity = ({ entity, parent }: EntityPayload): void => {
    this.addEntity(entity, parent)
  }

  /**
   * Removes object from scene
   * @param payload Entity event data
   * @returns void
   */
  private onEntityDestroy = ({ entity }: EntityPayload): void => {
    this.destroyEntity(entity)
  }

  addEntity (entity: Entity, parent?: Object3D): void {
    this.entities.push(entity)
    entity.subscribe('destroyed', this.onEntityDestroy)

    if (parent) parent.attach(entity)
    else super.add(entity)
    entity.enable()
  }

  destroyEntity (entity: Entity): void {
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
   * Updates all the active entities
   * @param payload Update event data
   * @returns void
   */
  update(payload: UpdatePayload) {
    const entities = this.entities

    entities.forEach(entity => entity.isEnabled && entity.update(payload))
  }

  destroy() {
    //
  }
}
