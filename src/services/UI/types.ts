import { Ref } from 'vue'

export type UIServiceState = {
  currentAction: Ref<string>
  showActions: Ref<boolean>
  showDialogue: Ref<boolean>
}
