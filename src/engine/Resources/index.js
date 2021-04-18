import { TextureLoader } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbxLoader = new FBXLoader()
const textureLoader = new TextureLoader()
const textures = []
const models = []

export default class Resources {
  constructor () { }

  static async loadObject (file) {
    if (models[file]) return models[file].clone()

    const object = await new Promise((resolve, reject) =>
      fbxLoader.load(
        file,
        object => resolve(object),
        _ => { },
        err => reject(err)
      )
    )

    models[file] = object.clone()

    return object
  }

  static async loadTexture (file) {
    if (textures[file]) return textures[file]

    textures[file] = textureLoader.load(file)

    return textures[file]
  }
}
