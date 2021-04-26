<template>
  <div
    class="g-touch-axis"
    :class="classes"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="g-touch-axis__background"
      :style="{ left: `${origin.x}px`, top: `${origin.y}px` }"
    >
      <span
        class="g-touch-axis__handle"
        :style="{ transform: `translate(${direction.x * 100 / 2}px, ${-direction.y * 100 / 2}px)` }"
      />
    </div>

    <span
      class="g-touch-axis__touch"
      :style="{ left: `${touch.x}px`, top: `${touch.y}px` }"
    >
    </span>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { Vector2 } from 'three'

export default {
  inject: ['renderer'],

  data: () => ({
    isDragging: false,
    direction: new Vector2(),
    origin: new Vector2(),
    touch: new Vector2()
  }),

  computed: {
    classes () {
      return {
        'g-touch-axis--is-dragging': this.isDragging
      }
    }
  },

  mounted () { },

  beforeUmount () { },

  methods: {
    onTouchStart (event) {
      event.preventDefault()
      const { touches } = event

      if (touches.length === 0) return

      this.origin.set(touches[0].pageX, touches[0].pageY)
      this.touch.copy(this.origin)
      this.isDragging = true
    },

    onTouchMove (event) {
      const { touches } = event
      this.touch.set(touches[0].pageX, touches[0].pageY)

      if (touches.length === 0) return

      this.direction = this.origin.clone().sub(this.touch).normalize()
      this.direction.x *= -1

      this.$emit('move', this.direction)
    },

    onTouchEnd (event) {
      this.direction.set(0, 0)
      this.isDragging = false
      this.$emit('move', this.direction)
    }
  }
}
</script>

<style lang="scss">
.g-touch-axis {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity .2s ease-in-out;
  mix-blend-mode: overlay;

  &__background {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(white, .2);
    box-shadow: 0 0 70px rgba(white, .3);
  }

  &__handle {
    top: 50%;
    left: 50%;
    margin-left: calc(-50px / 2);
    margin-top: calc(-50px / 2);
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 75px;
    transition: .2s ease-out;
    &:before {
      content: "";
      position: absolute;
      background: rgba(white, .5);
      width: 40%;
      height: 40%;
      border-radius: 75px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &__touch {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background: rgba(white, .1);
    position: absolute;
    transform: translate(-50%, -50%);
  }

  &--is-dragging {
    opacity: 1;
  }
}
</style>
