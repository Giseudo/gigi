import { UpdatePayload } from './events'

export interface IUpdatable {
  update(payload: UpdatePayload): void
}

export interface IStartable {
  start(): void
}

export interface IDestroyable {
  destroy(): void
}

export interface IActivable {
  active: boolean
  activate(): void
}

export interface IDisableable {
  active: boolean
  disable(): void
}
