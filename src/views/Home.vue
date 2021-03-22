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
    <g-sphere :position="[0, 0, 0]"></g-sphere>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { PointLight } from 'three'
import GSphere from '@/components/GSphere'
import GRipples from '@/components/GRipples'

export default defineComponent({
  name: 'Home',

  inject: ['viewport'],

  components: {
    GSphere,
    GRipples
  },

  data: () => ({
    light: null,
    amplitude: 1.0,
    frequency: 1.0,
    speed: 2.0,
    size: 30,
    pointSize: 8
  }),

  mounted () {
    this.light = new PointLight(0xffffff, 1, 50)
    this.light.position.set(10, 10, 10)

    this.viewport.scene.add(this.light)
  },

  beforeUnmount () {
    this.viewport.scene.remove(this.light)
    this.light.remove()
  }
})
</script>
