import { World } from 'ape-ecs'
import EntityFactory from './entityFactory'
import * as components from '@GComponents'

import {
  MovableSystem,
  ControllableSystem,
  DrawableSystem,
  DebugSystem
} from '@GSystems'

export default class GWorld extends World {
  entityFactory = new EntityFactory(this)

  init () {
    for (const key in components)
      this.registerComponent(components[key])

    this.registerSystem('update', MovableSystem)
    this.registerSystem('update', ControllableSystem)
    this.registerSystem('draw', DrawableSystem)
    this.registerSystem('draw', DebugSystem)
  }

  destroy () { }
}
