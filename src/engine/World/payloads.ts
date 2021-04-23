import { Object3D } from 'three'
import { EventPayload, Entity } from '@/engine'

export type Object3DPayload = EventPayload & {
  object: Object3D
}

export type EntityPayload = EventPayload & {
  entity: Entity
  parent?: Object3D
}
