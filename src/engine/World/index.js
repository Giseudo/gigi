import { World } from 'ape-ecs'
import EntityFactory from './entityFactory'

import {
  Transform,
  Body,
  InputReader,
  MeshRenderer
} from '@GComponents'

import {
  Movable,
  Controllable,
  Drawable
} from '@GSystems'

export default class GWorld extends World {
  entityFactory = new EntityFactory(this)

  init () {
    this.registerComponent(Transform)
    this.registerComponent(Body)
    this.registerComponent(InputReader)
    this.registerComponent(MeshRenderer)

    this.registerSystem('update', Movable)
    this.registerSystem('update', Controllable)
    this.registerSystem('draw', Drawable)
  }

  destroy () { }
}
