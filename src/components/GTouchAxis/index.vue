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
        :style="{ transform: `translate(${direction.x * 75 / 2}px, ${-direction.y * 75 / 2}px)` }"
      />
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { Vector2 } from 'three'

export default {
  data: () => ({
    isDragging: false,
    direction: new Vector2(),
    origin: new Vector2(),
    delta: new Vector2()
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
      this.isDragging = true
    },

    onTouchMove (event) {
      const { touches } = event

      if (touches.length === 0) return

      this.direction.set(touches[0].pageX, touches[0].pageY)
        .sub(this.origin)
        .normalize()

      this.direction.y *= -1

      this.$emit('move', this.direction)
    },

    onTouchEnd (event) {
      this.origin.set(0, 0)
      this.direction.set(0, 0)
      this.isDragging = false
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
  mix-blend-mode: overlay;

  &__background {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &:before {
      content: "";
      position: absolute;
      background: #aa2e1e;
      width: 40%;
      height: 40%;
      border-radius: 75px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 40px #ff2649;
    }
  }

  &__handle {
    top: 50%;
    left: 50%;
    margin-left: calc(-75px / 2);
    margin-top: calc(-75px / 2);
    position: absolute;
    width: 75px;
    height: 75px;
    border-radius: 75px;
    &:before {
      content: "";
      position: absolute;
      background: #ffd424;
      width: 40%;
      height: 40%;
      border-radius: 75px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &--is-dragging {
    opacity: 1;
  }
}
</style>
