import { UpdatePayload } from './payloads'

export interface IUpdatable {
  update(payload: UpdatePayload): void
}

export interface IStartable {
  start(): void
}

export interface IDestroyable {
  destroy(): void
}

export interface IActivatable {
  isEnabled: boolean
  enable(): void
  disable(): void
}
