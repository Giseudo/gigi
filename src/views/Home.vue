<template>
  <div class="g-home" />
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { Vector3 } from 'three'
import { BLOOM_LAYER } from '@GScene/layers'
import { Player, Warning, BMO, Skybox, RedStand, Environment } from '@/entities'

export default defineComponent({
  name: 'Home',

  inject: ['camera', 'world'],

  data: () => markRaw({
    playerData: { id: 'xgh-1r3-ai2', position: new Vector3(0, 0, 0) },
    entities: []
  }),
  
  async mounted () {
    const player = new Player(this.playerData, this.camera.mainCamera, 0xffff55)
    const stand = new RedStand()
    const skybox = new Skybox()
    const bmo = new BMO()
    const environment = new Environment()
    const warning = new Warning()

    stand.position.set(0, 0, 30)
    stand.scale.set(3.5, 3.5, 3.5)
    warning.position.set(0, 2, 0)
    bmo.position.set(0, 0, 5)

    this.camera.mainCamera.position.set(20, 10, -20)
    this.camera.mainCamera.lookAt(player.position)
    this.camera.follow(player)

    this.entities = [ player, stand, skybox, environment, warning ]
    this.entities.forEach(e => this.world.add(e))
  },

  beforeUnmount () {
    this.entities.forEach(e => e.destroy())
  }
})
</script>
