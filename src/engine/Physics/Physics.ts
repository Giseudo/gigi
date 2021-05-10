import { Sphere, Box3 } from 'three'

class Physics {
  public static SphereVsSphere(a: Sphere, b: Sphere): boolean {
    return a.intersectsSphere(b)
  }

  public static BoxVsBox(a: Box3, b: Box3): boolean {
    return a.intersectsBox(b)
  }

  public static BoxVsSphere(a: Box3, b: Sphere): boolean {
    return a.intersectsSphere(b)
  }
}

export default Physics
