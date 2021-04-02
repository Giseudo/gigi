import { TextureLoader } from 'three'
import 'three/examples/js/loaders/FBXLoader'

const { FBXLoader } = THREE

export default class GResources {
  fbxLoader = new FBXLoader()
  textureLoader = new TextureLoader()

  constructor () {
    //
  }

  loadTexture () {
    //
  }

  async loadObject (file, material) {
    const object = await new Promise((resolve, reject) =>
      this.fbxLoader.load(
        file,
        object => {
          object.traverse(e => {
            if (e.isMesh && material) {
              e.material.dispose()
              e.material = material
            }
          })

          resolve(object)
        },
        event => {},
        err => {
          console.error(err)
          reject(err)
        }
      )
    )

    return object
  }

  async loadTexture (file) {
    return await this.textureLoader.load(file)
  }
}
