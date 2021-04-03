import { Color, BufferGeometry, LineBasicMaterial, Vector3 } from 'three'
import { world } from '@GEngine'
import { DEBUG_LAYER } from '@GScene/layers'

export default async (params) => {
  const {
    origin = new Vector3(),
    end = new Vector3(),
    color = new Color(0x00ff00)
  } = params

  return {
    components: [
      { type: 'Line', origin, end },
      {
        type: 'MeshRenderer',
        geometry: new THREE.BufferGeometry(),
        material: new LineBasicMaterial({ color }),
        layer: DEBUG_LAYER,
      },
    ]
  }
}
