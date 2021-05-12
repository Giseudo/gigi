import { ref, readonly } from 'vue'

const state = {
  currentAction: ref(''),
  showActions: ref(false),
  showDialogue: ref(false)
}

export const setShowDialogue = (value: boolean) => {
  state.showDialogue.value = value
}

export const showShowActions = (value: boolean) => {
  state.showActions.value = value
}

export const setAction = (text: string) => {
  state.currentAction.value = text
}

export const showDialogue = readonly(state.showDialogue)
export const currentAction = readonly(state.currentAction)
