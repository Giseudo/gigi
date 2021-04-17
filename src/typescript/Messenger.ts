import { Object3D } from 'three'

// FIXME this should be a mixin
// We cannot extend everything from Object3D
export default class Messenger extends Object3D {
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
