import { CylinderGeometry, MeshBasicMaterial, TextureLoader, DoubleSide, Vector3 } from 'three'
import { world, resources } from '@GEngine'
import { BLOOM_LAYER } from '@GScene/layers'

export default async (params) => {
  const {
    position = new Vector3(),
    radius = 7.5,
    height = 3,
  } = params

  return {
    components: [
      { type: 'Transform', position },
      {
        type: 'MeshRenderer',
        geometry: new CylinderGeometry(radius, radius, height, 16, 1, true),
        material: new MeshBasicMaterial({
          color: 0xff6622,
          alphaMap: await resources.loadTexture(
            require('@/assets/warning_emission.png')
          ),
          side: DoubleSide,
          transparent: true
        }),
        layer: BLOOM_LAYER,
      },
    ]
  }
}
