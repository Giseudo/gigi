import { Mesh, SphereGeometry, Material } from 'three'
import { Entity, BLOOM_LAYER } from '@/engine'
import { SkyboxMaterial } from '@/materials'

export default class Skybox extends Entity {
  geometry: SphereGeometry
  material: SkyboxMaterial

  constructor (skyColor: number, groundColor: number) {
    super()
    this.geometry = new SphereGeometry(600, 32, 32)
    this.material = new SkyboxMaterial(skyColor, groundColor)
  }

  async start(): Promise<void> {
    const skybox = new Mesh(this.geometry, this.material)

    skybox.layers.enable(BLOOM_LAYER)
    this.add(skybox)
  }
}

