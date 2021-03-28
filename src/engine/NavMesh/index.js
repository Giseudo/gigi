import { Pathfinding } from 'three-pathfinding'

export default class GNavMesh {
  pathfinding = new Pathfinding()

  constructor () { }

  init (object) {
    object.traverse(node => {
      if (node.isMesh)
        this.pathfinding.setZoneData(
          'Level 1',
          Pathfinding.createZone(node.geometry)
        )
    })
  }

  destroy () { }
}
