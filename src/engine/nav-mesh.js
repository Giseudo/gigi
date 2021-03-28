import { Pathfinding } from 'three-pathfinding'

export default class NavMesh {
  pathfinding = new Pathfinding()

  constructor () {
  }

  init (object) {
    try {
      object.traverse(node => {
        if (node.isMesh)
          this.pathfinding.setZoneData('Level 1', Pathfinding.createZone(node.geometry))
      })
    } catch (e) {
      console.error(e)
    }
  }
}
