import { NavMesh as YukaNavMesh, NavMeshLoader } from 'yuka'
const loader = new NavMeshLoader()

export default class NavMesh extends YukaNavMesh {
  static previousRegion
  static instance = null

  async init () {
    NavMesh.instance = this

    const mesh = await loader.load(
      require('@/assets/NavMesh.glb').default, { epsilonCoplanarTest: .25 }
    )

    this.fromPolygons(mesh.regions)
  }

  destroy () { }

  static ClampPosition (startPosition, endPosition) {
    let clampedPosition = endPosition.clone()
    const region = NavMesh.instance.getRegionForPoint(endPosition)

    if (region) NavMesh.previousRegion = region

    NavMesh.instance.clampMovement(
      NavMesh.previousRegion,
      startPosition,
      endPosition,
      clampedPosition
    )

    return clampedPosition
  }
}
