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
    const environment = new Environment()
    this.entities.push(
      await Entity.Instantiate(environment)
    )
  },

  beforeUnmount () {
    this.entities.forEach(e => e.destroy())
    this.entities = []
  }
})
</script>
