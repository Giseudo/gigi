import { EventDispatcher } from 'three'
import { UpdatePayload } from '../payloads'
import { IStartable, IDestroyable, IActivatable, IUpdatable } from '../interfaces'
import Entity from './Entity'

export default class Component extends EventDispatcher implements IStartable, IDestroyable, IActivatable, IUpdatable {
  isEnabled: boolean = false
  entity?: Entity

  setEntity = (entity: Entity) => this.entity = entity

  start() {
    this.subscribe('onActivate', this.onActivate)
    this.subscribe('onDisable', this.onDisable)
    this.enable()
    this.publish('onStart')
  }

  destroy() {
    this.disable()
    this.unsubscribe('onActivate', this.onActivate)
    this.unsubscribe('onDisable', this.onDisable)
    this.publish('onDestroy')
  }

  update(payload: UpdatePayload): void { }

  enable() {
    this.isEnabled = true
    this.publish('onActivate')
  }

  disable() {
    this.isEnabled = false
    this.publish('onDisable')
  }

  onActivate(): void { }
  onDisable(): void { }

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
