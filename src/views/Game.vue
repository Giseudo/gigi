<template>
  <div class="game">
    <router-view></router-view>

    <g-touch-axis @move="onTouchChange" />
    <g-dialogue v-if="showDialogue" />
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { GTouchAxis, GDialogue } from '@/ui'
import { Entity, subscribe, unsubscribe } from '@/engine'
import { PlayerEntity, SkyboxEntity } from '@/entities'
import { Movement } from '@/components'
import { PRIMARY_AXIS } from '@/engine/Input'
import * as events from '@/engine/events'

export default {
  name: 'Game',

  inject: [ 'input', 'camera', 'network' ],

  components: { GTouchAxis, GDialogue },

  data: () => ({
    entities: markRaw([]),
    showDialogue: false,
  }),

  mounted () {
    this.init()
  },

  beforeUnmount () {
    this.destroy()
  },

  methods: {
    async init () {
      // Fix for hot reload
      this.network.players.forEach(player =>
        this.onPlayerJoined({ player })
      )
      if (this.network.player)
        this.onPlayerConnected({ player: this.network.player })

      subscribe(events.PLAYER_CONNECTED, this.onPlayerConnected)
      subscribe(events.PLAYER_JOINED, this.onPlayerJoined)
      subscribe(events.PLAYER_DISCONNECTED, this.onPlayerDisconnected)

      this.entities.push(
        await Entity.Instantiate(new SkyboxEntity(0x66c2ff, 0x4d0014))
      )
    },

    destroy () {
      unsubscribe(events.PLAYER_CONNECTED, this.onPlayerConnected)
      unsubscribe(events.PLAYER_JOINED, this.onPlayerJoined)
      unsubscribe(events.PLAYER_DISCONNECTED, this.onPlayerDisconnected)

      this.entities.forEach(e => e.destroy())
      this.entities = []
    },

    async onPlayerConnected ({ player }) {
      const entity = await Entity.Instantiate(
        new PlayerEntity(player, 0x33ff44, true, this.camera)
      )
      this.entities.push(entity)

      this.camera.position.set(0, 15, 20)
      this.camera.position.add(entity.position)
      this.camera.lookAt(entity.position)
      this.camera.follow(entity)

      entity.getComponent(Movement)
        .subscribe('moved', this.onPlayerMove)
    },

    async onPlayerJoined ({ player }) {
      if (player.socketId === this.network.player?.socketId) return

      const entity = await Entity.Instantiate(
        new PlayerEntity(player, 0xcc5522, false)
      )

      this.entities.push(entity)
    },

    onPlayerDisconnected ({ player }) {
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities[i]

        if (player.socketId === entity.userData.player.socketId)
          entity.destroy()
      }
    },

    onTouchChange (direction) {
      this.input.setAxis(PRIMARY_AXIS, direction)
    },

    onPlayerMove ({ position }) {
      this.network.updatePlayerPosition(position)
    }
  }
}
</script>
