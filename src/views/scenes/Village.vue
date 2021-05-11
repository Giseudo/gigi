<template>
  <div class="g-home" />
</template>

<script>
import { markRaw } from 'vue'
import { Warning, BMO, RedStand, Environment, BMOEntity } from '@/entities'
import { Entity } from '@/engine'

export default ({
  name: 'Village',

  data: () => ({
    entities: markRaw([])
  }),

  async mounted () {
    const environment = new Environment()
    const bmo = new BMOEntity()

    bmo.position.set(0, 0, -50)

    this.entities.push(
      await Entity.Instantiate(environment),
      await Entity.Instantiate(bmo)
    )
  },

  beforeUnmount () {
    this.entities.forEach(e => e.destroy())
    this.entities = []
  }
})
</script>
