import { defineComponent, markRaw } from 'vue'
import {
  IcosahedronGeometry,
  ShaderMaterial,
  Points,
  Color,
  CustomBlending,
  OneFactor,
  AddEquation
} from 'three'
import vertexShader from './ripples.vert.glsl'
import fragmentShader from './ripples.frag.glsl'

export default defineComponent({
  name: 'GRipples',

  inject: ['renderer', 'scene'],

  data: vm => markRaw({
    geometry: null,
    material: null,
    mesh: null,
    uniforms: {
      color: { value: new Color(vm.color) },
      amplitude: { value: vm.amplitude },
      frequency: { value: vm.frequency },
      speed: { value: vm.speed },
      timeOffset: { value: vm.timeOffset },
      pointSize: { value: vm.pointSize },
      time: vm.renderer.time,
      deltaTime: vm.renderer.deltaTime,
    }
  }),

  props: {
    amplitude: {
      type: Number,
      default: 0.2
    },
    frequency: {
      type: Number,
      default: 5.0
    },
    speed: {
      type: Number,
      default: 5.0
    },
    color: {
      type: Number,
      default: 0xffffff
    },
    timeOffset: {
      type: Number,
      default: 0.0
    },
    size: {
      type: Number,
      default: 3.0
    },
    pointSize: {
      type: Number,
      default: 4.0
    }
  },

  mounted () {
    this.geometry = new IcosahedronGeometry(this.size, 10)
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor
    })
    this.mesh = new Points(this.geometry, this.material)
    this.scene.add(this.mesh)
  },

  beforeUnmount () {
    this.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.mesh)
    this.mesh.remove()
  },

  render: () => ([])
})
