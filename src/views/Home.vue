<template>
  <div class="g-home" />
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { Vector3 } from 'three'
import { BLOOM_LAYER } from '@GScene/layers'

import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'

export default defineComponent({
  name: 'Home',

  inject: ['camera', 'entityFactory'],

  data: () => markRaw({
    objects: []
  }),

  async mounted () {
    const protagonist = await this.entityFactory.create('Protagonist', {
      position: new Vector3(0, 0, 10),
      radius: 2,
      height: 2,
      orientation: this.camera.mainCamera
    })

    this.objects.push(protagonist)

    const transform = protagonist.getOne('Transform')

    this.camera.mainCamera.position.set(0, 10, 25)
    this.camera.mainCamera.lookAt(transform.position)
    this.camera.follow(transform)

    this.objects.push(await this.entityFactory.create('Environment'))

    this.objects.push(
      await this.entityFactory.create('Warning', {
        position: new Vector3(-1, 3, -1),
        radius: 8,
        height: 3
      })
    )

    const bmo = await this.entityFactory.create('BMO', {
      position: new Vector3(0, 0, -120)
    })
    const { position: bmoPosition } = bmo.getOne('Transform')

    this.objects.push(bmo)

    for (let i = 0; i < 6; i++) {
      this.objects.push(
        await this.entityFactory.create('GrassBush', {
          position: bmoPosition.clone()
          .sub(new Vector3(3, 0, 0))
          .add(new Vector3(Math.cos(i) * 5, 0, Math.sin(i) * 5))
        })
      )
    }
  },

  beforeUnmount () {
    this.objects.forEach(obj => obj.destroy())
  },
})
</script>
