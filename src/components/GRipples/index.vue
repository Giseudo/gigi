<script>
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
import vertexShader from './ripples-vert.glsl'
import fragmentShader from './ripples-frag.glsl'

function delay (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export default defineComponent({
  name: 'GRipples',

  inject: ['viewport'],

  data: vm => markRaw({
    geometry: null,
    material: null,
    mesh: null,
    uniforms: {
      color: {
        type: 'v3',
        value: new Color(0xffffff)
      },
      amplitude: {
        type: 'float',
        value: vm.amplitude 
      },
      frequency: {
        type: 'float',
        value: vm.frequency
      },
      speed: {
        type: 'float',
        value: vm.speed
      },
      timeOffset: {
        type: 'float',
        value: vm.timeOffset
      },
      pointSize: {
        type: 'float',
        value: vm.pointSize
      }
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
    this.uniforms.color.value = new Color(this.color)
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

    this.uniforms.time = this.viewport.state.time
    this.uniforms.deltaTime = this.viewport.state.deltaTime

    this.viewport.scene.add(this.mesh)
  },

  beforeUnmount () {
    this.geometry.dispose()
    this.material.dispose()
    this.viewport.scene.remove(this.mesh)
    this.mesh.remove()
  },

  render () {
    return []
  }
})
</script>
