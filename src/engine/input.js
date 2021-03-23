import { reactive, readonly } from 'vue'
import { Vector2, EventDispatcher } from 'three'

export const BUTTON_DOWN = 'input/BUTTON_DOWN'
export const BUTTON_PRESS = 'input/BUTTON_PRESS'
export const BUTTON_UP = 'input/BUTTON_UP'

export const SECONDARY_AXIS = 'input/SECONDARY_AXIS'

export const UP_BUTTON = 'input/UP_BUTTON'
export const RIGHT_BUTTON = 'input/RIGHT_BUTTON'
export const DOWN_BUTTON = 'input/DOWN_BUTTON'
export const LEFT_BUTTON = 'input/LEFT_BUTTON'
export const CONFIRM_BUTTON = 'input/CONFIRM_BUTTON'

import { PRIMARY_AXIS, AXIS_CHANGED } from './types'

const Events = new EventDispatcher()

const state = reactive({
  axes: {
    [PRIMARY_AXIS]: {
      value: new Vector2(0, 0),
      vertical: {
        positive: ['up'],
        negative: ['down'],
      },
      horizontal: {
        positive: ['right'],
        negative: ['left'],
      }
    }
  },

  buttons: {
    up: ['w', 'W', 'ArrowUp'],
    down: ['s', 'S', 'ArrowDown'],
    left: ['a', 'A', 'ArrowLeft'],
    right: ['d', 'D', 'ArrowRight'],
    confirm: ['space'],
    cancel: ['esc']
  },

  pressing: []
})

const isPressing = button => state.pressing.includes(button)


export const changeAxis = (button) => {
  for (const topic in state.axes) {
    const axis = state.axes[topic]

    if (axis.vertical.positive.includes(button))
      axis.value.y = isPressing(button) ? 1 : 0
    if (axis.vertical.negative.includes(button))
      axis.value.y = isPressing(button) ? -1 : 0
    if (axis.horizontal.positive.includes(button))
      axis.value.x = isPressing(button) ? 1 : 0
    if (axis.horizontal.negative.includes(button))
      axis.value.x = isPressing(button) ? -1 : 0

    Events.dispatchEvent({ type: AXIS_CHANGED, value: axis.value })
  }
}

const onKeyDown = (event) => {
  if (event.repeat) return

  const { key } = event

  for (const button in state.buttons) {
    const buttonKeys = state.buttons[button]

    if (!buttonKeys.includes(key)) continue

    if (!isPressing(button)) state.pressing.push(button)

    if (['up', 'right', 'down', 'left'].includes(button))
      changeAxis(button)

    Events.dispatchEvent({ type: BUTTON_DOWN, button })
  }
}

const onKeyUp = (event) => {
  const { key } = event

  for (const button in state.buttons) {
    const keys = state.buttons[button]
    const index = state.pressing.indexOf(button)

    if (!keys.includes(key)) continue
    if (index < 0) continue

    state.pressing.splice(index, 1)

    if (['up', 'right', 'down', 'left'].includes(button))
      changeAxis(button)

    Events.dispatchEvent({ type: BUTTON_UP, button })
  }
}

export default {
  state: readonly(state),

  init: () => {
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
  },

  destroy: () => {
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
  },

  subscribe: (topic, callback) => {
    Events.addEventListener(topic, callback)
  },

  unsubscribe: (topic, callback) => {
    Events.removeEventListener(topic, callback)
  },

  getAxis: (axis) => state.axes[axis].value
}
