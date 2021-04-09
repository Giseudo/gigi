export default class EntityFactory {
  world = null

  constructor (world) {
    this.world = world
  }

  async create (id, params = {}) {
    const entity = await require(`@GEntities/${id}`).default(params)

    return this.world.createEntity({
      ...(params.id ? { id: params.id } : {}),
      ...entity
    })
  }
}
