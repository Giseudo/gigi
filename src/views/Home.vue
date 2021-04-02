<template>
  <div class="g-home" />
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { DoubleSide, CylinderGeometry, MeshBasicMaterial, TextureLoader, PointLight, ShaderMaterial, Color, Mesh, BoxGeometry, Vector3 } from 'three'
import { BLOOM_LAYER } from '@GScene/layers'

import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'

export default defineComponent({
  name: 'Home',

  inject: ['renderer', 'camera', 'scene', 'resources', 'world'],

  data: () => markRaw({
    protagonist: null,
    ground: null,
  }),

  async mounted () {
    const loader = new TextureLoader()

    const groundMesh = await this.resources.loadObject(
      require('@/assets/Environment.fbx').default,
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          color: { type: 'v3', value: new Color(0x73858e) },
          fogColor: { type: 'v3', value: new Color(0x252428) },
          tMatcap: { value: await loader.load(require('@/assets/matcap.png')) }
        }
      })
    )

    this.ground = this.world.createEntity({
      id: 'Ground',
      components: [
        { type: 'Transform' },
        { type: 'MeshRenderer', mesh: groundMesh }
      ]
    })

    this.warning = this.world.createEntity({
      id: 'Warning',
      components: [
        {
          type: 'Transform',
          position: new Vector3(-2, 3.8, -2)
        },
        {
          type: 'MeshRenderer',
          geometry: new CylinderGeometry(7.5, 7.5, 3, 16, 1, true),
          material: new MeshBasicMaterial({
            color: 0xff6622,
            alphaMap: await loader.load(require('@/assets/warning_emission.png')),
            side: DoubleSide,
            transparent: true
          }),
          layer: BLOOM_LAYER
        },
      ]
    })

    this.protagonist = this.world.createEntity({
      id: 'Protagonist',
      components: [
        {
          type: 'Transform',
          position: new Vector3(0, 2, 0)
        },
        {
          type: 'Body',
          acceleration: 100,
          maxVelocity: 30
        },
        {
          type: 'InputReader',
          orientation: this.camera.mainCamera
        },
        {
          type: 'MeshRenderer',
          geometry: new CylinderGeometry(4, 4, 3, 16, 1),
          material: new MeshBasicMaterial({ color: 0xff0000 }),
          layer: BLOOM_LAYER
        },
      ]
    })

    const transform = this.protagonist.getOne('Transform')

    this.camera.mainCamera.position.set(0, 15, 30)
    this.camera.mainCamera.lookAt(transform.position)
    this.camera.follow(transform)
  },

  beforeUnmount () {
    this.ground.destroy()
    this.warning.destroy()
    this.protagonist.destroy()
  },
})
</script>
