import { Object3D } from 'three'
import { reactive, computed } from 'vue'
import { Camera } from '@/engine'
import { SpeechServiceDependencies, SpeechServiceState, SpeechBalloon } from './types'

/**
 * Service responsible to handle the dialogues.
 * @class
 * @memberof Services
 */
class SpeechService {
  private state = reactive({
    balloons: {}
  } as SpeechServiceState)

  private camera: Camera

  /**
   * Creates a new DialogueService instance.
   * @returns DialogueService
   */
  public constructor (dependencies: SpeechServiceDependencies) {
    const { camera } = dependencies

    /** The main camera object. */
    this.camera = camera

    camera.addEventListener('moved', this.onCameraMove)
  }

  /**
   * Get reactive balloons array.
   * @returns Array<SpeechBalloon>
   */
  public get balloons () {
    return computed(() => this.state.balloons).value
  }

  /**
   * Get the given object speech balloon.
   * @returns SpeechBalloon
   */
  public getBalloon = (object: Object3D): SpeechBalloon => this.balloons[object.uuid]

  /**
   * Shows the speech balloon above the given object
   */
  public showBalloon (object: Object3D, text: string) {
    this.balloons[object.uuid] = {
      object: object,
      screenPosition: this.camera.getScreenPosition(object.position),
      text
    }
  }

  /**
   * Hides the speech balloon from the given object
   */
  public hideBalloon (object: Object3D) {
    delete this.state.balloons[object.uuid]
  }

  /**
   * Updates every speech balloon position. This should be called everytime
   * the main camera moves.
   */
  private onCameraMove = () => {
    for (const uuid in this.state.balloons) {
      const balloon = this.state.balloons[uuid]
      const worldPosition = balloon.object.position

      balloon.screenPosition = this.camera.getScreenPosition(worldPosition)
    }
  }
}

export default SpeechService
