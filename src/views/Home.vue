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

    <g-sphere :position="[0, 2, 0]" />
    <!--g-sphere :position="[4, 2, 8]" />
    <g-sphere :position="[0, 2, 4]" />
    <g-sphere :position="[4, 2, 0]" />
    <g-sphere :position="[4, 2, 4]" />
    <g-sphere :position="[0, 2, 8]" /-->
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { Vector2, MeshPhongMaterial, PointLight, Vector3, Mesh, PlaneGeometry } from 'three'
import { StandardNodeMaterial } from 'three/examples/jsm/nodes/Nodes'
import GSphere from '@/components/GSphere'
import GRipples from '@/components/GRipples'


export default defineComponent({
  name: 'Home',

  inject: ['renderer', 'camera', 'scene'],

  components: {
    GSphere,
    GRipples
  },

  data: () => markRaw({
    light: null,
    amplitude: 1.0,
    frequency: 1.0,
    speed: 2.0,
    size: 30,
    pointSize: 8,

    geometry: null,
    material: null,
    mesh: null
  }),

  mounted () {
    const { mainCamera } = this.camera

    this.light = new PointLight(0xbbddee, 1, 50)
    this.light.castShadow = true
    this.light.position.set(0, 10, 0)
    // this.light.shadow.mapSize = new Vector2(256, 256)

    mainCamera.position.set(0, 10, 10)
    mainCamera.rotation.x = -Math.PI / 4

    this.geometry = new PlaneGeometry(300, 300)
    this.material = new MeshPhongMaterial({ color: 0xffffff })
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI/ 2
    this.mesh.receiveShadow = true

    this.scene.add(this.light)
    this.scene.add(this.mesh)
  },

  beforeUnmount () {
    this.geometry.dispose()
    this.material.dispose()

    this.scene.remove(this.mesh)
    this.scene.remove(this.light)
    this.renderer.destroy()

    this.mesh.remove()
    this.light.remove()
  }
})
</script>
