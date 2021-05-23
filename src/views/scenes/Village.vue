<template>
  <div class="g-village">
    <span
      class="g-village__indicator"
      :style="{ left: `${bmoPosition.x}px`, top: `${bmoPosition.y}px` }"
      @click="onIndicatorClick"
    />
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { Warning, BMO, RedStand, Environment, BMOEntity } from '@/entities'
import { Entity, subscribe, unsubscribe, UPDATE } from '@/engine'
import { setAction, setShowDialogue } from '@/services/UI'

export default ({
  name: 'Village',

  inject: [ 'camera' ],

  setup () {
    return { setAction, setShowDialogue }
  },

  data: () => ({
    entities: markRaw([]),
    bmoPosition: {},
    bmo: null
  }),

  async mounted () {
    const environment = new Environment()
    const bmo = new BMOEntity()

    bmo.position.set(0, 0, -50)
    bmo.collider.subscribe('collisionStart', this.onShowInteraction)
    bmo.collider.subscribe('collisionEnd', this.onHideInteraction)

    this.bmo = bmo

    this.entities.push(
      await Entity.Instantiate(environment),
      await Entity.Instantiate(bmo)
    )

    subscribe(UPDATE, this.onUpdate)
  },

  beforeUnmount () {
    this.bmo.collider.unsubscribe('collisionStart', this.onShowInteraction)
    this.bmo.collider.unsubscribe('collisionEnd', this.onHideInteraction)

    this.entities.forEach(e => e.destroy())
    this.entities = []

    unsubscribe(UPDATE, this.onUpdate)
  },

  methods: {
    onShowInteraction() {
      this.setShowDialogue(true)
      this.setAction('hi friend :)')
    },

    onHideInteraction() {
      this.setShowDialogue(false)
      this.setAction('')
    },

    onUpdate({ deltaTime }) {
      const position = this.camera.getScreenPosition(this.bmo)

      this.bmoPosition = position
    },

    onIndicatorClick() {
      alert('AWWWWWWWWW, you clicked me >:B')
    }
  }
})
</script>

<style lang="scss">
.g-village {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  &__indicator {
    position: absolute;
    width: 100px;
    height: 100px;
    background: red;
    border-radius: 100px;
    transform: translate(-50%, 0px);
    z-index: 200;
  }
}
</style>
