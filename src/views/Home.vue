<template>
  <div class="g-home" />
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { Vector3 } from 'three'
import { BLOOM_LAYER } from '@GScene/layers'
import { Player, Warning, BMO, Skybox, Stand, Environment } from '@/entities'

import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'

export default defineComponent({
  name: 'Home',

  inject: ['camera', 'world'],

  data: () => markRaw({
    player: null,
    stand: null,
    skybox: null,
    environment: null,
    warning: null
  }),
  
  async mounted () {
    const player = new Player({
      id: 'xgh-1r3-ai2',
      position: new Vector3(0, 0, 0)
    })
    this.world.add(player)

    const stand = new Stand()
    stand.position.set(0, 0, 30)
    stand.scale.set(3.5, 3.5, 3.5)
    this.world.add(stand)

    const skybox = new Skybox()
    this.world.add(skybox)

    const bmo = new BMO()
    bmo.position.set(0, 0, 5)
    this.world.add(bmo)

    const environment = new Environment()
    this.world.add(environment)

    const warning = new Warning()
    warning.position.set(0, 2, 0)
    this.world.add(warning)

    this.player = player
    this.stand = stand
    this.skybox = skybox
    this.environment = environment
    this.warning = warning

    this.camera.mainCamera.position.set(0, 10, -20)
    this.camera.mainCamera.lookAt(this.player.position)
    this.camera.follow(this.player)
  },

  beforeUnmount () {
    this.player.destroy()
    this.stand.destroy()
    this.skybox.destroy()
    this.environment.destroy()
    this.warning.destroy()
  }
})
</script>
