import { EventDispatcher } from 'three'

export type EventPayload = {
  type: string,
  target: EventDispatcher
}
