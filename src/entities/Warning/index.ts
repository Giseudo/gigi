import { Mesh, CylinderGeometry, DoubleSide, MeshBasicMaterial } from 'three'
import { resources, Entity } from '@/engine'
import { BLOOM_LAYER } from '@/engine/Scene/layers'

export default class Warning extends Entity {
  radius: number = 7.5
  height: number = 3

  async start(): Promise<void> {
    const geometry = new CylinderGeometry(this.radius, this.radius, this.height, 16, 1, true)
    const material = new MeshBasicMaterial({
      color: 0xff6622,
      alphaMap: await resources.loadTexture(
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
