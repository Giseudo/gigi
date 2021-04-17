import { Vector3 } from 'three'
import { scene as world } from '../engine'
import { Player, Warning, BMO, Skybox, Stand, Environment } from '@/entities'

const player = new Player({
  id: 'xgh-1r3-ai2',
  position: new Vector3(0, 0, 0)
})
world.add(player)

const stand = new Stand()
stand.position.set(0, 0, 30)
stand.scale.set(3.5, 3.5, 3.5)
world.add(stand)

const skybox = new Skybox()
world.add(skybox)

const bmo = new BMO()
bmo.position.set(0, 0, 5)
world.add(bmo)

const environment = new Environment()
world.add(environment)

const warning = new Warning()
warning.position.set(0, 2, 0)
world.add(warning)

export { world }
