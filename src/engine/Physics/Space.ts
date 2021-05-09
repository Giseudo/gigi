import { Collider } from './Components'
import { Logger } from '../Logger'

/**
 * Handles collision detection
 * @class
 * @memberof GEngine.Physics
 */
class Space {
  private colliders: Array<Collider>

  constructor() {
  /**
   * The active colliders list.
   * @type Array<Collider>
   */
    this.colliders = []
  }

  /**
   * Initializes the space.
   * @returns {Promise<void>}
   */
  public async init(): Promise<void> { }

  /**
   * Destroys the space, dispose every collider.
   */
  public destroy(): void { }

  /**
   * Adds a collider to the space.
   * @param {Collider} collider The collider
   */
  public addCollider(collider: Collider): void {
    this.colliders.push(collider)
  }

  /**
   * Removes a collider from the space.
   * @param {Collider} collider The collider
   */
  public removeCollider(collider: Collider): void {
    const index = this.colliders.indexOf(collider)

    if (index < 0)
      return Logger.Warn(`Could not find shape on list.`)

    this.colliders.splice(index, 1)
  }
}

export default Space
