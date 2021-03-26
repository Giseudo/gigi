import { EventDispatcher } from 'three'

const dispatcher = new EventDispatcher()

export const publish = (type, data) => {
  dispatcher.dispatchEvent({ type, ...(data ? data : {}) })
}

export const subscribe = (topic, callback) => {
  dispatcher.addEventListener(topic, callback)
}

export const unsubscribe = (topic, callback) => {
  dispatcher.removeEventListener(topic, callback)
}
