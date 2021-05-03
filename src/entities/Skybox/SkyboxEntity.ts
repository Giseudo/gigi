import { Mesh, SphereGeometry, Color } from 'three'
import { Entity } from '@/engine'
import { SkyboxMaterial } from '@/materials'

export default class Skybox extends Entity {
  geometry: SphereGeometry
  material: SkyboxMaterial

  constructor (skyColor: Color|string|number) {
    super()
    this.geometry = new SphereGeometry(2000, 32, 32)
    this.material = new SkyboxMaterial(skyColor)
  }

  async start(): Promise<void> {
    const skybox = new Mesh(this.geometry, this.material)

    this.add(skybox)
  }
}

