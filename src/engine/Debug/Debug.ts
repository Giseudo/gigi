import { publish } from '../Messenger'
import { EventDispatcher, Color, BoxHelper, Object3D } from 'three'
import { ADD_OBJECT, REMOVE_OBJECT } from '../events'

export default class Debug extends EventDispatcher {
  static boxes: { [uuid: string]: any } = {}

  // TODO static DrawBox(position: Vector3, dimensions: Vector3, color: number|string) { }

  static DrawBoundingBox(object: Object3D, color: number|string = 0x00ff00): void {
    let helper = Debug.boxes[object.uuid]

    if (helper) helper.update()

    if (!helper) {
      helper = new BoxHelper(object, new Color(color))
      Debug.boxes[object.uuid] = helper
      publish(ADD_OBJECT, { object: helper })
      object.addEventListener('removed', Debug.RemoveObject)
    }
  }

  static RemoveObject({ target }: any) {
    const helper = Debug.boxes[target.uuid]

    if (!helper) return

    target.remove(helper)
    publish(REMOVE_OBJECT, { object: helper })

    target.removeEventListener('removed', Debug.RemoveObject)
    delete Debug.boxes[target.uuid]
  }
}
