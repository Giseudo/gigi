<template>
  <div class="g-home">
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
      :position="[0, 0, 8]"
      :size="1."
      @load="onProtagonistLoad"
    />
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { DoubleSide, CylinderGeometry, MeshBasicMaterial, TextureLoader, PointLight, ShaderMaterial, Color, Mesh, BoxGeometry } from 'three'
import { UPDATE } from '@Events'
import { BLOOM_LAYER } from '@Scene/layers'
import { subscribe } from '@Messenger'
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
    material: null,
    ground: null,
    cylinder: null,

    amplitude: 500.0,
    frequency: 1.0,
    speed: 2.0,
    size: 500,
    pointSize: 6,
  }),

  mounted () {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { type: 'v3', value: new Color(0x5b737f) },
        fogColor: { type: 'v3', value: new Color(0x252428) },
      }
    })

    this.resources.loadObject(require('@/assets/Environment.fbx').default, this.material)
      .then(obj => {
        this.ground = obj
        this.scene.add(obj)
      })

    const loader = new TextureLoader()

    loader.load(require('@/assets/warning_emission.png'), image => {
      const geometry = new CylinderGeometry(7.5, 7.5, 3, 16, 1, true)
      const material = new MeshBasicMaterial({
        color: 0xff6600,
        alphaMap: image,
        side: DoubleSide,
        transparent: true
      })
      this.cylinder = new Mesh(geometry, material)
      this.cylinder.position.set(-2, 3.8, -2)
      this.cylinder.layers.enable(BLOOM_LAYER)
      this.scene.add(this.cylinder)

      subscribe(UPDATE, this.onUpdate)
    })
  },

  beforeUnmount () {
    this.material.dispose()

    this.scene.remove(this.cylinder)
    this.scene.remove(this.ground)

    this.cylinder.remove()
    this.ground.remove()
  },

  methods: {
    onProtagonistLoad (object) {
      this.camera.mainCamera.position.set(0, 15, 30)
      this.camera.mainCamera.lookAt(object.position)
      this.camera.follow(object)
    },

    onUpdate ({ deltaTime }) {
      this.cylinder.rotateY(-deltaTime * .2)
    }
  }
})
</script>
