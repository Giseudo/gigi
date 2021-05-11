import { Object3D } from 'three'
import { EventPayload } from '../payloads'
import Entity from './Entity'

export type Object3DPayload = EventPayload & {
  object: Object3D
}

export type EntityPayload = EventPayload & {
  entity: Entity
  parent?: Object3D
}
