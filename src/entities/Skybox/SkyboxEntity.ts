import { Mesh, SphereGeometry } from 'three'
import { Entity } from '@/engine'
import { SkyboxMaterial } from '@/materials'

export default class Skybox extends Entity {
  async start(): Promise<void> {
    const geometry = new SphereGeometry(1000, 32, 32)
    const material = new SkyboxMaterial(0xff00ff, 0x00ffff)
    const skybox = new Mesh(geometry, material)

    this.add(skybox)
  }
}

