<template>
  <div class="g-home" />
</template>

<script>
import { markRaw } from 'vue'
import { Warning, BMO, RedStand, Environment } from '@/entities'
import { Entity } from '@/engine'

export default ({
  name: 'Village',

  data: () => ({
    entities: markRaw([])
  }),

  async mounted () {
    const stand = new RedStand()
    const environment = new Environment()

    stand.position.set(0, 0, 0)
    stand.scale.set(3.5, 3.5, 3.5)

    this.entities = [
      // await Entity.Instantiate(stand),
      await Entity.Instantiate(environment)
    ]
  },

  beforeUnmount () {
    this.entities.forEach(e => e.destroy())
    this.entities = []
  }
})
</script>
