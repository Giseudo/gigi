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

    <g-protagonist ref="protagonist" :position="[0, 2, 0]" />
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { ShaderMaterial, Color, Mesh, BoxGeometry } from 'three'
import GProtagonist from '@/components/GProtagonist'
import GRipples from '@/components/GRipples'
import vertexShader from '@/components/GBox/box.vert.glsl'
import fragmentShader from '@/components/GBox/box.frag.glsl'

export default defineComponent({
  name: 'Home',

  inject: ['renderer', 'camera', 'scene'],

  components: {
    GProtagonist,
    GRipples
  },

  data: () => markRaw({
    ambientLight: null,
    light: null,

    material: null,
    groundGeo: null,
    ground: null,
    boxGeo: null,
    box: null,

    depthPlaneMaterial: null,
    depthGeo: null,
    depthPlane: null,

    amplitude: 2.0,
    frequency: 1.0,
    speed: 2.0,
    size: 100,
    pointSize: 15,
  }),

  mounted () {
    this.camera.mainCamera.position.set(30, 40, 30)
    this.camera.mainCamera.lookAt(this.$refs.protagonist.mesh.position)
    this.camera.follow(this.$refs.protagonist.mesh)

    // Generic material
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { type: 'v3', value: new Color(0xffeebb) },
      }
    })

    // Ground
    this.groundGeo = new BoxGeometry(30, 200, 200)
    this.ground = new Mesh(this.groundGeo, this.material)
    this.ground.position.set(0, -100, 0)
    this.ground.receiveShadow = true

    // Cube
    this.boxGeo = new BoxGeometry(4, 4, 4)
    this.box = new Mesh(this.boxGeo, this.material)
    this.box.position.set(8, 2, 0)
    this.box.castShadow = true

    // Mount scene
    this.scene.add(this.ground)
    this.scene.add(this.box)
  },

  beforeUnmount () {
    this.material.dispose()
    this.groundGeo.dispose()
    this.boxGeo.dispose()

    this.scene.remove(this.ground)
    this.scene.remove(this.box)
    this.scene.remove(this.light)
    this.scene.remove(this.ambientLight)
    this.renderer.destroy()

    this.ground.remove()
    this.box.remove()
  }
})
</script>
