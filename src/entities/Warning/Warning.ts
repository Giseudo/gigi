import { Mesh, CylinderGeometry, DoubleSide, MeshBasicMaterial } from 'three'
import { Resources, Entity, BLOOM_LAYER } from '@/engine'

export default class Warning extends Entity {
  radius: number = 7.5
  height: number = 3

  async start(): Promise<void> {
    const geometry = new CylinderGeometry(this.radius, this.radius, this.height, 16, 1, true)
    const material = new MeshBasicMaterial({
      color: 0xff6622,
      alphaMap: await Resources.loadTexture(
        require('./Warning_Alpha.png')
      ),
      side: DoubleSide,
      transparent: true
    })

    const model = new Mesh(geometry, material)
    model.layers.enable(BLOOM_LAYER)

    this.add(model)
  }
}
