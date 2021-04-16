import { EventDispatcher } from 'three'

export default class Messenger extends EventDispatcher {
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
