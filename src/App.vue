<template>
  <div class="g-app">
    <router-view  v-if="!state.isLoading" />
    <g-touch-axis @move="onTouchChange" />
    <g-dialogue v-if="state.showDialogue" />

    <div class="debug"></div>
  </div>
</template>

<script lang="ts">
import { Engine, Entity, publish, subscribe, START, RESIZE, PRIMARY_AXIS, PLAYER_CONNECTED, PLAYER_DISCONNECTED, PLAYER_JOINED, PLAYERS_INIT } from '@/engine'
import { PlayerEntity } from '@/entities'
import { GTouchAxis, GDialogue } from '@/ui'
import { defineComponent, markRaw, reactive } from 'vue'

export default defineComponent({
  components: { GTouchAxis, GDialogue },

  setup: () => ({
    engine: new Engine()
  }),

  provide() {
    return {
      renderer: this.engine.renderer,
      camera: this.engine.camera,
      input: this.engine.input,
      world: this.engine.world,
      navMesh: this.engine.navMesh,
    }
  },

  data: () => markRaw({
    engine: {} as Engine,
    protagonist: {} as Entity,
    protagonistId: null,
    players: new Array<Entity>(),
    state: reactive({
      isLoading: true,
      showDialogue: false,
    })
  }),

  mounted () {
    this.init()

    subscribe(PLAYER_CONNECTED, this.onPlayerConnect)
    subscribe(PLAYER_DISCONNECTED, this.onPlayerDisconnect)
    subscribe(PLAYER_JOINED, this.onPlayerJoin)
    subscribe(PLAYERS_INIT, this.onPlayersInit)
  },

  beforeUnmount () {
    this.engine.destroy()
    this.protagonist?.destroy()

    for (const index in this.players)
      this.players[index].destroy()

    this.players = []
  },

  methods: {
    async init() {
      await this.engine.init(this.$el)

      this.state.isLoading = false
      this.engine.camera.position.set(0, 15, -20)

      publish(START)
    },

    onResize () {
      const width = window.innerWidth
      const height = window.innerHeight

      publish(RESIZE, { width, height })
    },

    onTouchChange(direction: any) {
      this.engine.input.setAxis(PRIMARY_AXIS, direction)
    },

    async onPlayerConnect ({ player: data }: any) {
      const entity = new PlayerEntity(data, 0xffff55, true, this.engine.camera)

      entity.subscribe('changedPosition', ({ x, y, z }: any) => {
        console.log('player moved', x, y, z)
      })

      this.protagonistId = data.socketId
      this.protagonist = entity
      this.engine.world.add(entity)

      this.engine.camera.position.set(10, 20, -10)
      this.engine.camera.lookAt(entity.position)
      this.engine.camera.follow(entity)
    },

    async onPlayerDisconnect ({ player }: any) {
      this.players.forEach((p: any, index: number) => {
        if (p.data.id === player.who) {
          p.destroy()
          this.players.splice(index, 1)
        }
      })
    },

    async onPlayerJoin ({ player: data }: any) {
      if (data.socketId === this.protagonistId) return

      const entity = new PlayerEntity(data, 0x00ff00, false)
      this.engine.world.add(entity)

      this.players.push(entity)
    },

    async onPlayersInit ({ players }: any) {
      for (let i = 0; i < players.length; i++) {
        const player = players[i]

        this.onPlayerJoin({ player })
      }
    }
  }
})
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body, html, #app {
  height: 100%;
  font-family: 'PressStart2P';
}

.g-app {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  touch-action: none;
  & > .g-dialogue {
    position: absolute;
    bottom: 0;
    left: 0;
    touch-action: none;
    & > .g-dialogue {
      position: absolute;
      bottom: 0;
      left: 0;
    }
    & > .debug {
      position: absolute;
      bottom: 20px;
      left: 20px;
      padding: 20px;
      background: black;
      color: white;
      font-size: 14px;
      overflow: auto;
      line-height: 200%;
    }
  }
}
</style>
