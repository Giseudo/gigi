<template>
  <div class="game">
    <router-view></router-view>

    <g-touch-axis @move="onTouchChange" />
    <g-dialogue v-if="showDialogue" />
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { subscribe, unsubscribe } from '@/engine'
import { PlayerEntity } from '@/entities'
import { GTouchAxis, GDialogue } from '@/ui'
import { Movement } from '@/components'
import { PLAYER_CONNECTED, PLAYER_JOINED, PLAYER_DISCONNECTED } from '@/engine/Messenger/events'
import { PRIMARY_AXIS } from '@/engine/Input'

export default {
  name: 'Game',

  inject: [ 'input', 'world', 'camera', 'network' ],

  components: { GTouchAxis, GDialogue },

  data: () => ({
    showDialogue: false,
    players: markRaw([])
  }),

  mounted () {
    this.init()
  },

  beforeUnmount () {
    this.destroy()
  },

  methods: {
    init () {
      // Fix for hot reload
      if (this.network.player)
        this.onPlayerConnected({ player: this.network.player })
      this.network.players.forEach(player => this.onPlayerJoined({ player }))

      subscribe(PLAYER_CONNECTED, this.onPlayerConnected)
      subscribe(PLAYER_JOINED, this.onPlayerJoined)
      subscribe(PLAYER_DISCONNECTED, this.onPlayerDisconnected)
    },

    destroy () {
      unsubscribe(PLAYER_CONNECTED, this.onPlayerConnected)
      unsubscribe(PLAYER_JOINED, this.onPlayerJoined)
      unsubscribe(PLAYER_DISCONNECTED, this.onPlayerDisconnected)

      this.players.forEach(e => e.destroy())
    },

    onPlayerConnected ({ player }) {
      const entity = new PlayerEntity(player, 0x33ff44, true, this.camera)
      this.players.push(entity)
      this.world.add(entity)

      this.camera.position.set(0, 15, -20)
      this.camera.lookAt(entity.position)
      this.camera.follow(entity)

      entity.getComponent(Movement)
        .subscribe('moved', this.onPlayerMove)
    },

    onPlayerJoined ({ player }) {
      if (player.socketId === this.network.player?.socketId) return

      const entity = new PlayerEntity(player, 0xcc5522, false)
      this.players.push(entity)
      this.world.add(entity)
    },

    onPlayerDisconnected ({ player }) {
      for (let i = 0; i < this.players.length; i++) {
        const entity = this.players[i]

        if (player.socketId === entity.data.socketId)
          this.world.remove(entity)
      }
    },

    onTouchChange (direction) {
      console.log(direction)
      this.input.setAxis(PRIMARY_AXIS, direction)
    },

    onPlayerMove ({ position }) {
      this.network.updatePlayerPosition(position)
    }
  }
}
</script>

<style lang="scss">
</style>
