import { TextureLoader } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export default class GResources {
  fbxLoader = new FBXLoader()
  textureLoader = new TextureLoader()
  models = {}
  textures = {}

  constructor () { }

  async loadObject (file, material) {
    if (this.models[file]) return this.models[file].clone()

    const object = await new Promise((resolve, reject) =>
      this.fbxLoader.load(
        file,
        object => {
          console.log(object)
          object.traverse(e => {
            if (e.isMesh && material) {
              e.material.dispose()
              e.material = material
            }
          })

          resolve(object)
        },
        event => {
          //
        },
        err => {
          console.error(err)
          reject(err)
        }
      )
    )

    this.models[file] = object.clone()

    return object
  }

  async loadTexture (file) {
    if (this.textures[file]) return this.textures[file]

    this.textures[file] = await this.textureLoader.load(file)

    return this.textures[file]
  }
}
