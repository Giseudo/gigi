import { NavMesh, NavMeshLoader } from 'yuka'

export default class GNavMesh extends NavMesh {
  loader = new NavMeshLoader()

  async init (object) {
    const navigator = await this.loader.load(
      require('@/assets/NavMesh.glb').default, { epsilonCoplanarTest: .25 }
    )

    this.fromPolygons(navigator.regions)
  }

  destroy () { }
}
