<template>
  <div class="home">
    <!--g-ripples
      :amplitude="amplitude"
      :frequency="frequency"
      :speed="speed"
      :time-offset=".0"
      :size="size"
      :point-size="pointSize - 2"
      :color="0xff0000"
    />
    <g-ripples
      :amplitude="amplitude"
      :frequency="frequency"
      :speed="speed"
      :time-offset=".25"
      :size="size"
      :point-size="pointSize - 2"
      :color="0x00ff00"
    />
    <g-ripples
      :amplitude="amplitude"
      :frequency="frequency"
      :speed="speed"
      :time-offset=".5"
      :size="size"
      :point-size="pointSize"
      :color="0x0000ff"
    /-->

    <g-protagonist
      ref="protagonist"
      :position="[0, 0, 0]"
      :size="1."
      @load="onProtagonistLoad"
    />
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { PointLight, ShaderMaterial, Color, Mesh, BoxGeometry } from 'three'
import GProtagonist from '@/components/GProtagonist'
import GRipples from '@/components/GRipples'
import vertexShader from '@/components/GBox/box.vert.glsl'
import fragmentShader from '@/components/GBox/box.frag.glsl'

export default defineComponent({
  name: 'Home',

  inject: ['renderer', 'camera', 'scene', 'resources'],

  components: {
    GProtagonist,
    GRipples
  },

  data: () => markRaw({
    ambientLight: null,
    light: null,
    material: null,
    ground: null,

    amplitude: 2.0,
    frequency: 1.0,
    speed: 2.0,
    size: 100,
    pointSize: 15,
  }),

  mounted () {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { type: 'v3', value: new Color(0xffeebb) },
        fogColor: { type: 'v3', value: new Color(0x252428) },
      }
    })

    this.resources.loadObject(require('@/assets/NavMesh.fbx').default, this.material)
      .then(obj => {
        this.ground = obj
        this.scene.add(obj)
      })

    this.pointLight = new PointLight()
    this.pointLight.position.set(0, 10, 20)
    this.scene.add(this.pointLight)
  },

  beforeUnmount () {
    this.material.dispose()
    this.light.remove()
    this.scene.remove(this.light)
    this.renderer.destroy()
  },

  methods: {
    onProtagonistLoad (object) {
      this.camera.mainCamera.position.set(20, 20, 20)
      this.camera.mainCamera.lookAt(object.position)
      this.camera.follow(object)
    }
  }
})
</script>
