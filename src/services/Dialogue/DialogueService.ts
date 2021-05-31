import { Object3D, Vector3 } from "three"
import { reactive, computed } from "vue"
import { Camera } from '@/engine'

type SpeechBalloon = {
  object: Object3D,
  screenPosition: Vector3,
  text: string
}

type SpeechBalloons = {
  [key: string]: SpeechBalloon
}

type DialogueServiceState = {
  balloons: SpeechBalloons
}

export default (camera: Camera) => {
  const state = reactive({
    balloons: {}
  } as DialogueServiceState)

  const showSpeechBalloon = (object: Object3D, text: string) => {
    state.balloons[object.uuid] = {
      object: object,
      screenPosition: camera.getScreenPosition(object.position),
      text
    }
  }

  const hideSpeechBalloon = (object: Object3D) => {
    delete state.balloons[object.uuid]
  }

  const updateBalloonsPosition  = () => {
    for (const uuid in state.balloons) {
      const balloon = state.balloons[uuid]
      const worldPosition = balloon.object.position

      balloon.screenPosition = camera.getScreenPosition(worldPosition)
    }
  }

  const getBalloon = (object: Object3D): SpeechBalloon => {
    return state.balloons[object.uuid]
  }

  return {
    showSpeechBalloon,
    hideSpeechBalloon,
    updateBalloonsPosition,
    getBalloon,
    balloons: computed(() => state.balloons)
  }
}
