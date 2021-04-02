import { CylinderGeometry, MeshBasicMaterial, Vector3 } from 'three'
import { world } from '@GEngine'
import { BLOOM_LAYER } from '@GScene/layers'

export default async (params) => {
  const {
    position = new Vector3(),
    rotation = new Vector3(),
    scale = new Vector3(),
    acceleration = 30,
    maxVelocity = 20,
    radius = 4,
    height = 3,
    orientation,
  } = params

  if (!orientation)
    console.warn('InputReader: orientation is required')

  return {
    components: [
      { type: 'Transform', position, rotation, scale },
      { type: 'Body', acceleration, maxVelocity, orientation },
      { type: 'InputReader', orientation },
      {
        type: 'MeshRenderer',
        geometry: new CylinderGeometry(radius, radius, height, 16, 1),
        material: new MeshBasicMaterial({ color: 0xff0000 }),
        layer: BLOOM_LAYER,
      },
    ]
  }
}

