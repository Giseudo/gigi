import { Vector3, EventDispatcher, Group, Color, Vector2, BufferGeometry, BufferAttribute, Line, LineLoop, LineBasicMaterial, Box3, Box3Helper } from 'three'

const TAU = 6.28318530718

/**
 * Debug helper class.
 * @class
 * @extends THREE.EventDispatcher
 * @memberof GEngine.Debug
 */
class Debug extends EventDispatcher {
  static ShowGizmos: boolean = false

  static CreateCircle(radius: number = 5, color: Color|string|number = 0xff0000, segments: number = 16): Line {
    const vertices: Array<Vector2> = []

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * TAU 

      vertices.push(new Vector2(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius
      ))
    }

    const geometry = new BufferGeometry().setFromPoints(vertices)
    const material = new LineBasicMaterial({ color, toneMapped: false })
    const line = new LineLoop(geometry, material)

    return line
  }

  static CreateSphere(radius: number, center: Vector3 = new Vector3(), color: Color|string|number = 0xff0000, segments: number = 16): Group {
    const group: Group = new Group()
    const x: Line = Debug.CreateCircle(radius, color, segments)
    const y: Line = Debug.CreateCircle(radius, color, segments)
    const z: Line = Debug.CreateCircle(radius, color, segments)

    x.rotateY(TAU / 4)
    y.rotateX(TAU / 4)

    group.add(x)
    group.add(y)
    group.add(z)

    group.position.add(center)

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

  static CreateBox3(box: Box3, color: Color|string|number = 0xff0000): Line {
    const helper = new Box3Helper(box, new Color(color))

    return helper
  }
}

export default Debug
