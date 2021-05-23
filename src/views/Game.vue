<template>
  <div class="g-game">
    <router-view></router-view>

    <g-touch-axis @move="onTouchChange" />

    <g-hud>
      <template v-slot:top>
        <span class="g-game__visor g-game__visor--top" />
      </template>

      <template v-slot:down>
        <span class="g-game__visor g-game__visor--bottom" />
      </template>

      <template v-slot:right>
        <div class="g-game__sidenav g-game__sidenav--right">
          <span class="g-game__square" v-for="square in 10" />
          <span class="g-game__line" />
          <div class="g-game__rect">
            So cool! :D

            <button @click="onClick" class="g-game__button">
              A Button OMG
            </button>
          </div>
        </div>
      </template>
    </g-hud>

    <g-dialogue
      class="g-game__dialogue"
      v-if="showDialogue"
    >
      {{ currentAction }}
    </g-dialogue>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { GTouchAxis, GDialogue, GHud } from '@/ui'
import { Entity, subscribe, unsubscribe } from '@/engine'
import { PlayerEntity, SkyboxEntity } from '@/entities'
import { Movement } from '@/components'
import { PRIMARY_AXIS } from '@/engine/Input'
import { showDialogue, currentAction } from '@/services/UI'
import * as events from '@/engine/events'

export default {
  name: 'Game',

  inject: [ 'input', 'camera', 'network' ],

  components: { GTouchAxis, GDialogue, GHud },

  setup () {
    return { showDialogue, currentAction }
  },

  data: () => ({
    entities: markRaw([])
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

      this.camera.position.set(0, 4, 15)
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
    },

    onClick () {
      alert('You`ve just clicked me :)')
    }
  }
}
</script>

<style lang="scss">
.g-game {
  &__dialogue {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  &__sidenav {
    text-align: right;
  }
  &__square {
    width: 10px;
    height: 20px;
    border: 2px solid orange;
    display: inline-block;
    margin-left: 2px;
    transform: skew(-15deg);
  }
  &__line {
    width: 140px;
    height: 2px;
    background: orange;
    display: block;
    margin: 2px 0 0 auto;
  }
  &__rect {
    width: 300px;
    height: 200px;
    display: block;
    background: rgba(black, .4);
    margin-top: 20px;
    transform-origin: 100% 0%;
    padding: 20px;
    color: white;
    text-shadow: 2px 2px black;
    border-radius: 10px;
  }
  &__button {
    margin-top: 20px;
    padding: 10px 30px;
    display: inline-block;
    font-size: 18px;
  }
  &__visor {
    width: 60%;
    height: 40px;
    margin: 40px auto;
    border-left: 2px solid white;
    border-right: 2px solid white;
    opacity: .5;
    &--top {
      border-top: 2px solid white;
    }
    &--bottom {
      border-bottom: 2px solid white;
      align-self: flex-end;
    }
  }
}
</style>
