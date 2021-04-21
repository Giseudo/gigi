import { reactive } from 'vue'
import { Vector2 } from 'three'
import { publish } from '@GMessenger'
import { AXIS_CHANGED, BUTTON_DOWN, BUTTON_PRESS, BUTTON_UP } from '@GEvents'

export const PRIMARY_AXIS = 'input/PRIMARY_AXIS'
export const SECONDARY_AXIS = 'input/SECONDARY_AXIS'
export const UP_BUTTON = 'input/UP_BUTTON'
export const RIGHT_BUTTON = 'input/RIGHT_BUTTON'
export const DOWN_BUTTON = 'input/DOWN_BUTTON'
export const LEFT_BUTTON = 'input/LEFT_BUTTON'
export const CONFIRM_BUTTON = 'input/CONFIRM_BUTTON'
export const CANCEL_BUTTON = 'input/CANCEL_BUTTON'

export default class Input {
  state = reactive({
    axes: {
      [PRIMARY_AXIS]: {
        value: new Vector2(),
        vertical: {
          positive: [UP_BUTTON],
          negative: [DOWN_BUTTON],
        },
        horizontal: {
          positive: [RIGHT_BUTTON],
          negative: [LEFT_BUTTON],
        }
      }
    },

    buttons: {
      [UP_BUTTON]: ['w', 'W', 'ArrowUp'],
      [DOWN_BUTTON]: ['s', 'S', 'ArrowDown'],
      [LEFT_BUTTON]: ['a', 'A', 'ArrowLeft'],
      [RIGHT_BUTTON]: ['d', 'D', 'ArrowRight'],
      [CONFIRM_BUTTON]: ['space'],
      [CANCEL_BUTTON]: ['esc']
    },

    pressing: [],
  })

  getAxis = axis => this.state.axes[axis].value
  isPressing = button => this.state.pressing.includes(button)

  init () {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('blur', this.reset)
  }

  destroy () {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
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

      publish(AXIS_CHANGED, { axis: topic, value: axis.value })
    }
  }

  setAxis (axis, direction) {
    this.state.axes[axis].value = direction

    publish(AXIS_CHANGED, { axis, value: direction })
  }

  onKeyDown = (event) => {
    if (event.repeat) return

    const { key } = event

    for (const button in this.state.buttons) {
      const buttonKeys = this.state.buttons[button]

      if (!buttonKeys.includes(key)) continue

      if (!this.isPressing(button)) this.state.pressing.push(button)

      if ([UP_BUTTON, RIGHT_BUTTON, DOWN_BUTTON, LEFT_BUTTON].includes(button))
        this.changeAxis(button)

      publish(BUTTON_DOWN)
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

      if ([UP_BUTTON, RIGHT_BUTTON, DOWN_BUTTON, LEFT_BUTTON].includes(button))
        this.changeAxis(button)

      publish(BUTTON_UP, { button })
    }
  }

  reset = () => {
    this.state.pressing = []
    this.setAxis(PRIMARY_AXIS, new Vector2())
  }
}
