import { EventDispatcher } from 'three'
import Entity from '../Entity'

export type UpdatePayload = {
  time: number
  unscaledTime: number
  deltaTime: number
  unscaledDeltaTime: number
}

export type EventPayload = {
  type: string,
  target: EventDispatcher
}

export type EntityEventPayload = EventPayload & {
  entity: Entity
}
