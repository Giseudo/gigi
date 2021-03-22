import { readonly } from 'vue'
import { Vector3 } from 'three'

export default function init () {
  Vector3.Forward = new Vector3(0, 0, -1)
  Vector3.Up = new Vector3(0, 1, 0)
  Vector3.Right = new Vector3(1, 0, 0)
}
