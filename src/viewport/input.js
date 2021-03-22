
const state = () => ({
  axes: {
    primary: new Vector2(0, 0),
    secondary: new Vector2(0, 0)
  },
  buttons: {
    up: ['w', 'up'],
    down: ['s', 'down'],
    left: ['a', 'left'],
    right: ['d', 'right'],
    confirm: ['space'],
    cancel: ['esc']
  }
})

export const onAxisChange = () => {
  const horizontal = 0
  const vertical = 0
}
