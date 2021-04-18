import { NavMesh as YNavMesh, NavMeshLoader } from 'yuka'

export default class NavMesh extends YNavMesh {
  loader = new NavMeshLoader()

  async init () {
    const navigator = await this.loader.load(
      require('@/assets/NavMesh.glb').default, { epsilonCoplanarTest: .25 }
    )

    this.fromPolygons(navigator.regions)
  }

  destroy () { }
}
