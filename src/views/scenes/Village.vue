<template>
  <div class="g-home" />
</template>

<script>
import { markRaw } from 'vue'
import { Warning, BMO, RedStand, Environment, BMOEntity } from '@/entities'
import { Entity } from '@/engine'
import { setAction, setShowDialogue } from '@/services/UI'

export default ({
  name: 'Village',

  setup () {
    return { setAction, setShowDialogue }
  },

  data: () => ({
    entities: markRaw([]),
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
  },

  beforeUnmount () {
    this.bmo.collider.unsubscribe('collisionStart', this.onShowInteraction)
    this.bmo.collider.unsubscribe('collisionEnd', this.onHideInteraction)

    this.entities.forEach(e => e.destroy())
    this.entities = []
  },

  methods: {
    onShowInteraction() {
      this.setShowDialogue(true)
      this.setAction('hi friend :)')
    },

    onHideInteraction() {
      this.setShowDialogue(false)
      this.setAction('')
    }
  }
})
</script>
