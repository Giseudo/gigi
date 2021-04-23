<template>
  <div class="g-home" />
</template>

<script>
import { markRaw } from 'vue'
import { Warning, BMO, Skybox, RedStand, Environment } from '@/entities'
import { Entity } from '@/engine'

const entities = []

export default ({
  name: 'Village',

  async mounted () {
    const skybox = await Entity.Instantiate(new Skybox())
    const stand = await Entity.Instantiate(new RedStand())
    const environment = await Entity.Instantiate(new Environment())

    stand.position.set(0, 0, 0)
    stand.scale.set(3.5, 3.5, 3.5)

    entities.push(skybox)
    entities.push(stand)
    entities.push(environment)
  },

  beforeUnmount () {
    entities.forEach(e => e.destroy())
    entities.splice(entities.length)
  }
})
</script>
