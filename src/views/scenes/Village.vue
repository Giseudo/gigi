<template>
  <div class="g-village">
    <transition-group name="fade" tag="div">
      <span
        :key="key"
        v-for="balloon, key in balloons"
        class="g-village__indicator"
        :style="{ left: `${balloon.screenPosition.x}px`, top: `${balloon.screenPosition.y}px` }"
        @click="onIndicatorClick"
      >
        {{ balloon.text }}
      </span>
    </transition-group>
  </div>
</template>

<script>
import { markRaw, inject } from 'vue'
import { Warning, BMO, RedStand, Environment, BMOEntity } from '@/entities'
import { Entity, subscribe, unsubscribe, UPDATE } from '@/engine'

export default ({
  name: 'Village',

  inject: [ 'camera', 'dialogueService' ],

  data: vm => ({
    entities: markRaw([]),
    balloons: vm.dialogueService.balloons,
    bmo: null
  }),

  async mounted () {
    const environment = new Environment()
    const bmo = new BMOEntity()

    this.bmo = bmo

    this.bmo.position.set(0, 0, -50)
    this.bmo.collider.subscribe('collisionStart', this.onBMOApproach)
    this.bmo.collider.subscribe('collisionEnd', this.onBMOMoveAway)

    subscribe(UPDATE, this.onUpdate)

    this.entities.push(
      await Entity.Instantiate(environment),
      await Entity.Instantiate(bmo)
    )
  },

  beforeUnmount () {
    this.entities.forEach(e => e.destroy())
    this.entities = []

    this.bmo.collider.unsubscribe('collisionStart', this.onBMOApproach)
    this.bmo.collider.unsubscribe('collisionEnd', this.onBMOMoveAway)
    this.onBMOMoveAway()
  },

  methods: {
    onIndicatorClick() {
      alert('AWWWWWWWWW, you clicked me >:B')
    },

    onBMOApproach () {
      this.dialogueService.showSpeechBalloon(
        this.bmo, 'Hello friend! How are yooou? <3'
      )
    },

    onBMOMoveAway () {
      this.dialogueService.hideSpeechBalloon(this.bmo)
    },

    onUpdate () {
      this.dialogueService.updateBalloonsPosition()
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
  perspective: 200px;
  z-index: 20;
  &__indicator {
    padding: 10px;
    position: absolute;
    background: rgba(white, .7);
    transform: scaleY(1) translate(-50%, -100%);
    z-index: 200;
    text-shadow: 2px 2px white;
    width: 250px;
    text-align: center;
    font-size: 14px;
    line-height: 150%;
    &:before {
      content: "";
      position: absolute;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 20px solid rgba(white, .7);
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.fade-enter-active {
  transition: opacity .15s, transform .3s;
}
.fade-leave-active {
  transition: opacity .1s, transform .1s;
}
.fade-enter-from, .fade-leave-to {
  transform: scaleY(0) translate(-50%, -100%);
}
</style>
