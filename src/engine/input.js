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

export default class GInput {
  events = new EventDispatcher()

  state = reactive({
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

  getAxis = axis => this.state.axes[axis].value
  isPressing = button => this.state.pressing.includes(button)

  init () {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  destroy () {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  publish (type, data) {
    this.events.dispatchEvent({ type, ...(data ? data : {}) })
  }

  subscribe (topic, callback) {
    this.events.addEventListener(topic, callback)
  }

  unsubscribe (topic, callback) {
    this.events.removeEventListener(topic, callback)
  }

  changeAxis = (button) => {
    for (const topic in this.state.axes) {
      const axis = this.state.axes[topic]

      if (axis.vertical.positive.includes(button))
        axis.value.y = this.isPressing(button) ? 1 : 0
      if (axis.vertical.negative.includes(button))
        axis.value.y = this.isPressing(button) ? -1 : 0
      if (axis.horizontal.positive.includes(button))
        axis.value.x = this.isPressing(button) ? 1 : 0
      if (axis.horizontal.negative.includes(button))
        axis.value.x = this.isPressing(button) ? -1 : 0

      this.publish(AXIS_CHANGED, { value: axis.value })
    }
  }

  onKeyDown = (event) => {
    if (event.repeat) return

    const { key } = event

    for (const button in this.state.buttons) {
      const buttonKeys = this.state.buttons[button]

      if (!buttonKeys.includes(key)) continue

      if (!this.isPressing(button)) this.state.pressing.push(button)

      if (['up', 'right', 'down', 'left'].includes(button))
        this.changeAxis(button)

      this.publish(BUTTON_DOWN)
    }
  }

  onKeyUp = (event) => {
    const { key } = event

    for (const button in this.state.buttons) {
      const keys = this.state.buttons[button]
      const index = this.state.pressing.indexOf(button)

      if (!keys.includes(key)) continue
      if (index < 0) continue

      this.state.pressing.splice(index, 1)

      if (['up', 'right', 'down', 'left'].includes(button))
        this.changeAxis(button)

      this.publish(BUTTON_UP, { button })
    }
  }
}
