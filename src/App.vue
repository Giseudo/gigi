<template>
  <div class="g-app">
    <div class="viewport" ref="viewport">
      <router-view  v-if="!isLoading" />
      <g-touch-axis @move="onTouchChange" />
      <g-dialogue v-if="showDialogue" />
      <div class="debug" v-if="protagonist">
        <div v-for="player in allPlayers">
          {{ player.id }}: {{ printPos(player) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './typescript/Game.ts'

import GEngine from '@GEngine'
import { GTouchAxis } from '@UI'
import { GDialogue } from '@UI'
import { defineComponent, markRaw, reactive } from 'vue'
import { publish, subscribe } from '@GMessenger'
import { START, RESIZE, PLAYER_CONNECTED, PLAYER_DISCONNECTED, PLAYER_JOINED, PLAYERS_INIT } from '@GEvents'
import { PRIMARY_AXIS } from '@GInput'

export default defineComponent({
  components: {
    GTouchAxis,
    GDialogue
  },

  provide () {
    this.engine = new GEngine()

    return {
      resources: this.engine.resources,
      renderer: this.engine.renderer,
      camera: this.engine.camera,
      input: this.engine.input,
      scene: this.engine.scene,
      navMesh: this.engine.navMesh,
      world: this.engine.world,
      entityFactory: this.engine.world.entityFactory
    }
  },

  data: () => ({
    isLoading: true,
    showDialogue: false,
    protagonist: null,
    protagonistId: null,
    players: []
  }),

  computed: {
    allPlayers () {
      return [ this.protagonist, ...this.players ]
    }
  },

  mounted () {
    this.init()

    subscribe(PLAYER_CONNECTED, this.onPlayerConnect)
    subscribe(PLAYER_DISCONNECTED, this.onPlayerDisconnect)
    subscribe(PLAYER_JOINED, this.onPlayerJoin)
    subscribe(PLAYERS_INIT, this.onPlayersInit)

    window.addEventListener('resize', this.onResize)
  },

  beforeUnmount () {
    this.engine.destroy()
    this.protagonist.destroy()

    for (const index in this.players)
      this.players[index].destroy()

    this.players = []

    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    async init () {
      await this.engine.init(this.$refs.viewport)
      this.skybox = this.engine.world.entityFactory.create('Skybox')

      this.isLoading = false
      this.engine.camera.mainCamera.position.set(0, 15, -20)

      publish(START)
    },

    printPos (player) {
      const { position } = player.getOne('Transform')

      const x = position.x.toFixed(2)
      const y = position.y.toFixed(2)
      const z = position.z.toFixed(2)

      return JSON.stringify({ x, y, z })
    },

    onResize () {
      const width = window.innerWidth
      const height = window.innerHeight

      publish(RESIZE, { width, height })
    },

    onTouchChange (direction) {
      this.engine.input.setAxis(PRIMARY_AXIS, direction)
    },

    async onPlayerConnect ({ player }) {
      const { x, y, z } = player.position

      this.protagonistId = player.socketId
      this.protagonist = await this.engine.world.entityFactory.create('Protagonist', {
        id: player.socketId,
        position: new THREE.Vector3(x, y, z),
        orientation: this.engine.camera.mainCamera
      })

      const transform = this.protagonist.getOne('Transform')

      this.engine.camera.mainCamera.lookAt(transform.position)
      this.engine.camera.follow(transform)
    },

    async onPlayerDisconnect ({ player }) {
      const entity = this.engine.world.getEntity(player.socketId)
      const index = this.players.indexOf(entity)

      entity.destroy()

      if (index >= 0)
        this.players.splice(index, 1)
    },

    async onPlayerJoin ({ player }) {
      if (player.socketId === this.protagonistId) return

      const { x, y, z } = player.position

      const entity = await this.engine.world.entityFactory.create('Player', {
        id: player.socketId,
        position: new THREE.Vector3(x, y, z)
      })

      this.players.push(entity)
    },

    async onPlayersInit ({ players }) {
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
  position: relative;
  height: 100%;
  overflow: hidden;
  & > .viewport {
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
