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
     :time-offset=".1"
      :size="size"
      :point-size="pointSize - 2"
      :color="0x00ff00"
    />
    <g-ripples
      :amplitude="amplitude"
      :frequency="frequency"
      :speed="speed"
      :time-offset=".2"
      :size="size"
      :point-size="pointSize"
      :color="0x0000ff"
    /-->

    <g-sphere ref="protagonist" :position="[0, 2, 0]" />
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { TextureLoader, ShaderMaterial, AmbientLight, PointLight, Color, Vector3, Mesh, PlaneGeometry, BoxGeometry } from 'three'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import vertexShader from '@/components/GBox/box-vert.glsl'
import fragmentShader from '@/components/GBox/box-frag.glsl'
import GSphere from '@/components/GSphere'
import GRipples from '@/components/GRipples'
import * as types from '@/engine/types'

export default defineComponent({
  name: 'Home',

  inject: ['renderer', 'camera', 'scene'],

  components: {
    GSphere,
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

    amplitude: 1.0,
    frequency: 1.0,
    speed: 2.0,
    size: 30,
    pointSize: 8,
  }),

  mounted () {
    const { mainCamera } = this.camera

    mainCamera.position.set(0, 40, 30)
    mainCamera.lookAt(this.$refs.protagonist.mesh.position)

    // generic material
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { type: 'v3', value: new Color(0xffeebb) },
      }
    })

    // ground
    this.groundGeo = new BoxGeometry(30, 200, 30)
    this.ground = new Mesh(this.groundGeo, this.material)
    this.ground.position.set(0, -100, 0)
    this.ground.receiveShadow = true

    // cube
    this.boxGeo = new BoxGeometry(4, 4, 4)
    this.box = new Mesh(this.boxGeo, this.material)
    this.box.position.set(8, 2, 0)
    this.box.castShadow = true

    // mount scene
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
  },
})
</script>
