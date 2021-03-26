<template>
  <div class="sphere" />
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { IcosahedronGeometry, Color, ShaderMaterial, Mesh, Vector3 } from 'three'
import { StandardNodeMaterial } from 'three/examples/jsm/nodes/Nodes'
import { UPDATE, DRAW, PRIMARY_AXIS, AXIS_CHANGED } from '@/engine/types'
import * as Nodes from 'three/examples/jsm/nodes/Nodes'

import vertexShader from './sphere-vert.glsl'
import fragmentShader from './sphere-frag.glsl'

const clamp = (number, min, max) => Math.max(min, Math.min(number, max))

export default defineComponent({
  name: 'GSphere',

  inject: ['renderer', 'input', 'camera', 'scene'],

  data: () => markRaw({
    mesh: null,
    geometry: null,
    material: null,
    acceleration: 60,
    velocity: new Vector3(0, 0, 0)
  }),

  props: {
    size: {
      type: Number,
      default: 2
    },
    detail: {
      type: Number,
      default: 10
    },
    position: {
      type: Array,
      default: () => ([0, 0, 0])
    },
    maxVelocity: {
      type: Number,
      default: 20
    }
  },

  computed: {
    isMoving () {
      return this.input.getAxis(PRIMARY_AXIS).lengthSq() > 0
    }
  },

  watch: {
    size: { handler: 'setSize' },
    position: { handler: 'setPosition' }
  },

  mounted () {
    this.geometry = new IcosahedronGeometry(1, this.detail)
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: false,
      depthWrite: true,
      uniforms: {
        color: {
          type: 'v3',
          value: new Color(0xff0000)
        },
        time: this.renderer.time
      },
    })
    this.material.roughness = new Nodes.FloatNode(0.2)

    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.castShadow = true
    this.setPosition(this.position)
    this.setSize(this.size)

    this.scene.add(this.mesh)
    this.renderer.subscribe(UPDATE, this.onUpdate)
  },

  beforeUnmount () {
    this.renderer.unsubscribe(UPDATE, this.onUpdate)
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
    this.mesh.remove()
  },

  methods: {
    setSize (value) {
      this.mesh.scale.set(value, value, value)
    },

    setPosition ([ x, y, z ]) {
      this.mesh.position.set(x, y, z)
    },

    onUpdate ({ deltaTime }) {
      this.adjustVelocity(deltaTime)
      this.mesh.position.add(
        new Vector3()
          .copy(this.velocity)
          .multiplyScalar(deltaTime)
      )
    },

    adjustVelocity (deltaTime) {
      const direction = this.getOrientedDirection(this.input.getAxis(PRIMARY_AXIS))

      if (!this.isMoving)
        this.velocity.multiplyScalar(.9)
      else
        this.velocity.add(direction.multiplyScalar(this.acceleration * deltaTime))

      this.velocity.clampLength(0, this.maxVelocity)
    },

    getOrientedDirection (direction) {
      const { mainCamera } = this.camera

      const right = new Vector3(1, 0, 0).applyQuaternion(mainCamera.quaternion)
      right.y = 0
      right.normalize()

      const forward = new Vector3(0, 0, -1).applyQuaternion(mainCamera.quaternion)
      forward.y = 0
      forward.normalize()

      return right.multiplyScalar(direction.x)
        .add(forward.multiplyScalar(direction.y))
    }
  }
})
</script>
