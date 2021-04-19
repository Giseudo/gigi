import { Color, ShaderMaterial, Object3D } from 'three'
import { MatcapVertex, MatcapFragment } from '@/assets/shaders'
import { Resources, Entity } from '@/engine'
import { TriplanarMaterial } from '@/materials'
import { Warning } from '@/entities'
console.log(TriplanarMaterial)

export default class Environment extends Entity {
  async start(): Promise<void> {
    const terrainModel: Object3D = await Resources.loadObject(
      require('./Terrain.fbx').default
    )
    const terrainMaterial = new TriplanarMaterial(
      await Resources.loadTexture(require('@/assets/textures/Grass.png')),
      await Resources.loadTexture(require('@/assets/textures/Stone.png'))
    )
    terrainModel.traverse((node: any) => {
      if (node.isMesh) node.material = terrainMaterial
    })

    const warningModel = new Warning()
    warningModel.position.set(-1, 5, -4)
    await warningModel.start()
    terrainModel.attach(warningModel)

    terrainModel.position.set(20, 5, -20)

    const model: Object3D = await Resources.loadObject(
      require('./Environment.fbx').default,
    )

    const material = new ShaderMaterial({
      vertexShader: MatcapVertex,
      fragmentShader: MatcapFragment,
      uniforms: {
        color: { value: new Color(0x73858e) },
        fogColor: { value: new Color(0x3b1400) },
        tMatcap: {
          value: await Resources.loadTexture(require('./Environment_Matcap.png'))
        }
      }
    })

    model.traverse((node: any) => {
      if (node.isMesh) node.material = material
    })

    this.add(model)
    this.add(terrainModel)
  }
}

