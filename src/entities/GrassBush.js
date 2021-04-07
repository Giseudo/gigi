import { Vector3, MeshBasicMaterial, NearestFilter } from 'three'
import { resources } from '@GEngine'

export default async (params) => {
  const {
    position = new Vector3(),
    rotation = new Vector3(),
    scale = new Vector3(),
  } = params

  const model = await resources.loadObject(require('@/assets/GrassBush.fbx').default)
  const texture = await resources.loadTexture(require('@/assets/GrassBush_Color.png'))
  texture.minFilter = NearestFilter
  texture.magFilter = NearestFilter

  model.traverse(node => {
    if (node.isMesh) {
      node.material.dispose()
      node.material = new MeshBasicMaterial({
        map: texture,
        transparent: true
      })
    }
  })

  return {
    components: [
      { type: 'Transform', position, rotation, scale },
      {
        type: 'MeshRenderer',
        mesh: model,
      },
    ]
  }
}

