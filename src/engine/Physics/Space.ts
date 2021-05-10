import { Collider } from '../Components'
import { Logger } from '../Logger'
import { subscribe } from '../Messenger'
import { UPDATE } from '../events'
import { UpdatePayload } from '../payloads'

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
  public async init(): Promise<void> {
    subscribe(UPDATE, this.onUpdate)
  }

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

  public onUpdate(_: UpdatePayload): void {
    this.checkCollisions()
  }

  public checkCollisions(): void {
    for (let i = 0; i < this.colliders.length; i++) {
      const a = this.colliders[i]

      for (let j = 0; i < this.colliders.length; j++) {
        const b = this.colliders[j]

        if (a === b) continue

        a.intersectsWith(b)
      }
    }
  }
}

export default Space
