import { Object3D, TextureLoader } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbxLoader = new FBXLoader()
const textureLoader = new TextureLoader()
const textures: Array<any> = []
const models: Array<any> = []

export default class Resources {
  constructor() { }

  static async loadObject(file: any) {
    if (models[file]) return models[file].clone()

    const object: Object3D = await new Promise((resolve, reject) =>
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

  static async loadTexture(file: any) {
    if (textures[file]) return textures[file]

    textures[file] = textureLoader.load(file)

    return textures[file]
  }
}
