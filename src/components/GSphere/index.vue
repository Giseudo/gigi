<template>
  <div class="sphere" />
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { IcosahedronGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three'
import { StandardNodeMaterial } from 'three/examples/jsm/nodes/Nodes'
import * as Nodes from 'three/examples/jsm/nodes/Nodes'

export default defineComponent({
  name: 'GSphere',

  inject: ['viewport'],

  data: () => markRaw({
    mesh: null,
    geometry: null,
    material: null,
    keys: {
      up: false,
      right: false,
      down: false,
      left: false
    },
    speed: 20.0,
    velocity: new Vector3(0, 0, 0)
  }),

  props: {
    size: {
      type: Number,
      default: 2
    },
    detail: {
      type: Number,
      default: 10
    },
    position: {
      type: Array,
      default: () => ([0, 0, 0])
    }
  },

  watch: {
    size: { handler: 'setSize' },
    position: { handler: 'setPosition' }
  },

  mounted () {
    const { scene } = this.viewport

    this.geometry = new IcosahedronGeometry(1, this.detail)
    this.material = new StandardNodeMaterial({ color: 0xffffff })

    this.material.color = new Nodes.ColorNode(0xffffff)
    this.material.roughness= new Nodes.FloatNode(0.)

    /*const { MUL, ADD } = Nodes.OperatorNode
    const localPosition = new Nodes.PositionNode()
    const localY = new Nodes.SwitchNode(localPosition, 'y')

    let offset = new Nodes.MathNode(
      new Nodes.OperatorNode(localY, this.viewport.state.time, MUL),
      Nodes.MathNode.SIN
    )
    offset = new Nodes.OperatorNode(offset, new Nodes.FloatNode(0.2), MUL)
    offset = new Nodes.OperatorNode(offset, new Nodes.FloatNode(1.0), MUL)
    this.material.position = new Nodes.OperatorNode(localPosition, offset, MUL)*/

    this.mesh = new Mesh(this.geometry, this.material)
    this.setPosition(this.position)
    this.setSize(this.size)

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)

    scene.add(this.mesh)

    this.viewport.subscribe('update', this.onUpdate)
  },

  beforeUnmount () {
    const { scene } = this.viewport

    scene.remove(this.mesh)

    this.geometry.dispose()
    this.material.dispose()
    this.mesh.remove()
    this.viewport.unsubscribe('update', this.onUpdate)
  },

  methods: {
    setSize (value) {
      this.mesh.scale.x = value
      this.mesh.scale.y = value
      this.mesh.scale.z = value
    },

    setPosition ([ x, y, z ]) {
      this.mesh.position.x = x
      this.mesh.position.y = y
      this.mesh.position.z = z
    },

    onUpdate ({ detail }) {
      const { deltaTime } = detail

      if (this.keys.left) this.velocity.x -= 1
      if (this.keys.right) this.velocity.x += 1
      if (this.keys.down) this.velocity.y -= 1
      if (this.keys.up) this.velocity.y += 1

      this.mesh.position.x += this.velocity.x * this.speed * deltaTime
      this.mesh.position.y += this.velocity.y * this.speed * deltaTime
      this.mesh.position.z += this.velocity.z * this.speed * deltaTime

      this.velocity.set(0,0,0)
    },

    onKeyDown (event) {
      const { key } = event

      if (key === 'w') this.keys.up = true
      if (key === 'd') this.keys.right = true
      if (key === 's') this.keys.down = true 
      if (key === 'a') this.keys.left = true
    },

    onKeyUp (event) {
      const { key } = event

      if (key === 'w') this.keys.up = false
      if (key === 'd') this.keys.right = false
      if (key === 's') this.keys.down = false 
      if (key === 'a') this.keys.left = false
    },

    move (x, y) {
      this.mesh.position.x += x
      this.mesh.position.y += y
    }
  }
})
</script>
