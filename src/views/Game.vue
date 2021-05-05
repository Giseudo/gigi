<template>
  <div class="game">
    <router-view></router-view>

    <g-hud>
      <template v-slot:top>
        <span class="visor visor--top" />
      </template>

      <template v-slot:down>
        <span class="visor visor--down" />
      </template>

      <template v-slot:left>
        <img class="vector" :src="require('@/assets/vector.svg')" />
      </template>

      <template v-slot:right>
        <span class="square" v-for="square in 20" />
        <span class="line" />
      </template>
    </g-hud>

    <g-touch-axis @move="onTouchChange" />
    <g-dialogue v-if="showDialogue" />
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { GTouchAxis, GDialogue, GHud } from '@/ui'
import { Entity, subscribe, unsubscribe } from '@/engine'
import { PlayerEntity, SkyboxEntity } from '@/entities'
import { Movement } from '@/components'
import { PRIMARY_AXIS } from '@/engine/Input'
import * as events from '@/engine/events'

export default {
  name: 'Game',

  inject: [ 'input', 'camera', 'network' ],

  components: { GTouchAxis, GDialogue, GHud },

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
        await Entity.Instantiate(new SkyboxEntity(0xf00f35))
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
        new PlayerEntity(player, 0xff2244, true, this.camera)
      )
      this.entities.push(entity)

      this.camera.position.set(0, 1.5, 8)
      this.camera.position.add(entity.position)
      this.camera.lookAt(entity.position)
      this.camera.follow(entity)

      entity.getComponent(Movement)
        .subscribe('moved', this.onPlayerMove)
    },

    async onPlayerJoined ({ player }) {
      if (player.socketId === this.network.player?.socketId) return

      const entity = await Entity.Instantiate(
        new PlayerEntity(player, 0x486588, false)
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

<style lang="scss">
.visor {
  position: absolute;
  width: 50%;
  left: 50%;
  transform: translateX(-50%);
  height: 30px;
  border-right: 2px solid rgba(white, .2);
  border-left: 2px solid rgba(white, .2);
  &--top {
    border-top: 2px solid rgba(white, .2);
    top: 80px;
  }
  &--down {
    border-bottom: 2px solid rgba(white, .2);
    bottom: 80px;
  }
}

.vector {
  opacity: .5;
  position: absolute;
  &:first-child {
    left: 40px;
    top: 40px;
    transform: scaleY(-1);
  }
  &:last-child {
    left: 40px;
    bottom: 40px;
  }
}

.square {
  width: 10px;
  height: 20px;
  border: 2px solid orange;
  display: inline-block;
  transform: skew(-15deg);
  margin-right: 2px;
  margin-top: 40px;
}

.line {
  width: 120px;
  display: inline-block;
  border-bottom: 5px solid orange;
  position: absolute;
  top: 90px;
  right: 25px;
  transform: skew(-15deg);
}
</style>
