import vertexShader from './player.vert.glsl'
import fragmentShader from './player.frag.glsl'
import { Object3D, Color, Mesh, ShaderMaterial, MeshBasicMaterial } from 'three'
import { PlayerData } from '@/typescript/types'
import { Entity, camera, resources } from '@/engine'
import { BLOOM_LAYER } from '@/engine/Scene/layers'
import { PRIMARY_AXIS } from '@/engine/Input'
import InputReader from '@/components/InputReader'
import Movement from '@/components/Movement'

type PlayerParams = {
  color: Color,
  acceleration?: number, // 50
  maxVelocity?: number, // 20
  orientation?: Object3D
}

export default class Player extends Entity {
  data: PlayerData
  color: Color
  inputReader: InputReader
  movement: Movement

  constructor(data: PlayerData, params: PlayerParams) {
    super()
    this.data = data
    this.color = params.color
    this.inputReader = this.addComponent(new InputReader(camera.mainCamera))
    this.movement = this.addComponent(new Movement())
  }

  async start(): Promise<void> {
    const model = await resources.loadObject(require('./Navigator.fbx').default)

    this.add(model)

    model.traverse(async (node: Mesh) => {
      if (node.isMesh) {
        if (node.name === 'Emission') {
          node.material = new MeshBasicMaterial({ color: 0xff2200 })
          node.layers.enable(BLOOM_LAYER)
        }

        if (node.name === 'Body')
          node.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              color: {
                value: new Color(0xC0C0C0)
              },
              tMatcap: {
                value: await resources.loadTexture(require('./Player_Matcap.png'))
              }
            }
          })
      }
    })
  }

  update(payload: any) {
    super.update(payload)
    this.movement.move(this.inputReader.getOrientedAxis(PRIMARY_AXIS))

    this.position.add(
      this.movement.velocity.clone().multiplyScalar(payload.deltaTime)
    )
  }
}

/* Stick to navmesh
const { velocity } = entity.getOne('Rigidbody')
const transform = entity.getOne('Transform')
const region = navMesh.getRegionForPoint(transform.position)
const startPosition = transform.position.clone()

if (region) this.region = region

  transform.position.add(
    velocity.clone().multiplyScalar(deltaTime)
  )

  const endPosition = transform.position.clone()

  navMesh.clampMovement(
    this.region,
    startPosition,
    endPosition,
    transform.position
  )
 */
