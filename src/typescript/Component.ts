import { UpdatePayload, IStartable, IDestroyable, IActivable, IDisableable, IUpdatable } from './types'
import Messenger from './Messenger'
import Entity from './Entity'

export default class Component extends Messenger implements IStartable, IDestroyable, IActivable, IDisableable, IUpdatable {
  active: boolean = false
  entity?: Entity

  setEntity = (entity: Entity) => this.entity = entity

  start() {
    this.subscribe('onActivate', this.onActivate)
    this.subscribe('onDisable', this.onDisable)
    this.activate()
    this.publish('onStart')
  }

  destroy() {
    this.disable()
    this.unsubscribe('onActivate', this.onActivate)
    this.unsubscribe('onDisable', this.onDisable)
    this.publish('onDestroy')
  }

  update(payload: UpdatePayload): void { }

  activate() {
    this.active = true
    this.publish('onActivate')
  }

  disable() {
    this.active = false
    this.publish('onDisable')
  }

  onActivate(): void { }
  onDisable(): void { }
}
