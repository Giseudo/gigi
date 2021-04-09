<template>
  <div class="g-app">
    <div class="viewport" ref="viewport">
      <router-view  v-if="!state.isLoading" />
      <g-touch-axis @move="onTouchChange" />
      <g-dialogue v-if="state.showDialogue" />
      <div class="players">
        {{ players }}
      </div>
    </div>
  </div>
</template>

<script>
import GEngine from '@GEngine'
import { GTouchAxis } from '@UI'
import { GDialogue } from '@UI'
import { defineComponent, markRaw, reactive } from 'vue'
import { publish, subscribe } from '@GMessenger'
import { START, RESIZE, PLAYER_CONNECTED, PLAYERS_CHANGED } from '@GEvents'
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

  computed: {
    players () {
      return JSON.stringify(this.state.players)
    }
  },

  data: () => markRaw({
    protagonistId: null,
    protagonist: {},
    state: reactive({
      isLoading: true,
      players: []
    })
  }),

  mounted () {
    this.init()

    subscribe(PLAYER_CONNECTED, this.onProtagonistConnected)
    subscribe(PLAYERS_CHANGED, this.onPlayersChanged)

    window.addEventListener('resize', this.onResize)
  },

  beforeUnmount () {
    this.engine.destroy()
    this.protagonist.destroy()

    for (const index in this.state.players)
      this.state.players[index].destroy()

    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    async init () {
      await this.engine.init(this.$refs.viewport)
      this.skybox = this.engine.world.entityFactory.create('Skybox')

      this.state.isLoading = false
      this.engine.camera.mainCamera.position.set(0, 10, 25)

      publish(START)
    },

    onResize () {
      const width = window.innerWidth
      const height = window.innerHeight

      publish(RESIZE, { width, height })
    },

    onTouchChange (direction) {
      this.engine.input.setAxis(PRIMARY_AXIS, direction)
    },

    async onProtagonistConnected ({ player }) {
      const { X, Y, Z } = player.position

      this.protagonistId = player.socketId
      this.protagonist = await this.engine.world.entityFactory.create('Protagonist', {
        position: new THREE.Vector3(X, Y, Z),
        orientation: this.engine.camera.mainCamera
      })

      const transform = this.protagonist.getOne('Transform')

      this.engine.camera.mainCamera.lookAt(transform.position)
      this.engine.camera.follow(transform)
    },

    async onPlayersChanged ({ players }) {
      for (let j = 0; j < this.state.players.length; j++) {
        this.state.players[j].destroy()
        this.state.players.splice(j, 1)
      }

      for (let i = 0; i < players.length; i++) {
        const player = players[i]

        if (player.socketId === this.protagonistId) continue

        const entity = await this.engine.world.entityFactory.create('Player', {
          position: new THREE.Vector3(0, 0, 10)
        })

        this.state.players.push(entity)
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
    & > .players {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 20px;
      background: black;
      color: white;
    }
  }
}
</style>
