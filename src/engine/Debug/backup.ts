import { Object3D, BoxHelper, Color } from 'three'
import { publish } from '../Messenger'
import { ADD_OBJECT, REMOVE_OBJECT } from '../events'

const boxes: { [uuid: string]: any } = {}

function DrawBoundingBox(object: Object3D, color: number|string = 0x00ff00): void {
  let helper = boxes[object.uuid]

  if (helper) helper.update()

  if (!helper) {
    helper = new BoxHelper(object, new Color(color))
    boxes[object.uuid] = helper
    publish(ADD_OBJECT, { object: helper })
    object.addEventListener('removed', RemoveObject)
  }
}

function RemoveObject({ target }: any) {
  const helper = boxes[target.uuid]

  if (!helper) return

    target.remove(helper)
    publish(REMOVE_OBJECT, { object: helper })

    target.removeEventListener('removed', RemoveObject)
    delete boxes[target.uuid]
}
