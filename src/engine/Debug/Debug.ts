import { EventDispatcher, Group, Color, Vector2, BufferGeometry, BufferAttribute, Line, LineLoop, LineBasicMaterial } from 'three'
// import { publish } from '../Messenger'
// import { ADD_OBJECT, REMOVE_OBJECT } from '../events'

export default class Debug extends EventDispatcher {
  static boxes: { [uuid: string]: any } = {}

  static CreateCircle(radius: number = 5, color: Color|string|number = 0xff0000, segments: number = 16): Line {
    const vertices: Array<Vector2> = []

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * TAU 

      vertices.push(new Vector2(
        Math.cos(theta) * radius / 2,
        Math.sin(theta) * radius / 2
      ))
    }

    const geometry = new BufferGeometry().setFromPoints(vertices)
    const material = new LineBasicMaterial({ color, toneMapped: false })
    const line = new LineLoop(geometry, material)

    return line
  }

  static CreateSphere(radius: number, color: Color|string|number = 0xff0000, segments: number = 16): Group {
    const group: Group = new Group()

    const x: Line = Debug.CreateCircle(radius, color, segments)
    const y: Line = Debug.CreateCircle(radius, color, segments)
    const z: Line = Debug.CreateCircle(radius, color, segments)

    x.rotateY(TAU / 4)
    y.rotateX(TAU / 4)

    group.add(x)
    group.add(y)
    group.add(z)

    return group
  }

  static CreateBox(size: number = 1, color: Color|string|number = 0xff0000): Line {
    const geometry = new BufferGeometry()
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

    geometry.setAttribute('position', new BufferAttribute(vertices, 3))

    const material = new LineBasicMaterial({ color, toneMapped: false })
    const line = new Line(geometry, material)

    return line
  }

  /*static DrawBoundingBox(object: Object3D, color: number|string = 0x00ff00): void {
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
  }*/
}
