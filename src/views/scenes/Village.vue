<template>
  <div class="g-home" />
</template>

<script>
import { markRaw } from 'vue'
import { Warning, BMO, Skybox, RedStand, Environment } from '@/entities'

export default ({
  name: 'Home',

  inject: [ 'world'],

  data: () => markRaw({
    entities: []
  }),
  
  async mounted () {
    const stand = new RedStand()
    const skybox = new Skybox()
    const bmo = new BMO()
    const environment = new Environment()

    stand.position.set(0, 0, 30)
    stand.scale.set(3.5, 3.5, 3.5)
    bmo.position.set(0, 0, 5)

    this.entities = [ stand, skybox, environment ]
    this.entities.forEach(e => this.world.add(e))
  },

  beforeUnmount () {
    this.entities.forEach(e => e.destroy())
  }
})
</script>
