import { Collider } from '../Components'
import { Logger } from '../Logger'
import { subscribe } from '../Messenger'
import { UPDATE, ADD_ENTITY } from '../events'
import { EntityPayload } from '../payloads'

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
    subscribe(ADD_ENTITY, this.onAddEntity)
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

  public onUpdate = () => {
    this.checkCollisions()
  }

  public onAddEntity = ({ entity }: EntityPayload): void => {
    for (let i = 0; i < entity.components.length; i++) {
      const component = entity.components[i]

      if (component instanceof Collider)
        this.addCollider(component)
    }
  }

  public checkCollisions(): void {
    for (let i = 0; i < this.colliders.length; i++) {
      const a = this.colliders[i]

      for (let j = 0; j < this.colliders.length; j++) {
        const b = this.colliders[j]

        if (a === b) continue

        a.intersectsWith(b)
      }
    }
  }
}

export default Space
