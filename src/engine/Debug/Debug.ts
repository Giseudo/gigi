import { EventDispatcher, Color, BoxHelper, Object3D, BufferGeometry, BufferAttribute, Line, LineBasicMaterial } from 'three'
import { publish } from '../Messenger'
import { ADD_OBJECT, REMOVE_OBJECT } from '../events'

export default class Debug extends EventDispatcher {
  static boxes: { [uuid: string]: any } = {}

  static CreateBox(size: number = 1, color: number|string = 0xff0000): Line {
    const geo = new BufferGeometry()
    size /= 2

    const vertices = new Float32Array([
      -size,  size,  size,
       size,  size,  size,

       size,  size,  size,
       size, -size,  size,

       size, -size,  size,
      -size, -size,  size,

      -size, -size,  size,
      -size,  size,  size,

      -size,  size,  size,
      -size,  size, -size,

      -size,  size, -size,
       size,  size, -size,

       size,  size, -size,
       size,  size,  size,

       size,  size, -size,
       size, -size, -size,

       size, -size, -size,
       size, -size,  size,

       size, -size, -size,
      -size, -size, -size,

      -size, -size, -size,
      -size,  size, -size,

      -size, -size, -size,
      -size, -size,  size,
    ])

    geo.setAttribute('position', new BufferAttribute(vertices, 3))

    const mat = new LineBasicMaterial({ color, toneMapped: false })
    const mesh = new Line(geo, mat)

    return mesh
  }

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
