import GRenderer from '@GRenderer'
import GCamera from '@GCamera'
import GInput from '@GInput'
import GNavMesh from '@GNavMesh'

import World from '../typescript/World'
import Entity from '../typescript/Entity'
import Component from '../typescript/Component'
import Resources from './Resources'

export const camera = new GCamera()
export const scene = new World()
export const renderer = new GRenderer(scene, camera.mainCamera)
export const navMesh = new GNavMesh()
export const input = new GInput()

export default class GEngine {
  camera
  scene
  renderer
  navMesh
  input

  constructor () {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.navMesh = navMesh
    this.input = input
  }

  async init (el) {
    this.renderer.init(el)
    this.camera.init()
    this.input.init()
    await this.navMesh.init()
  }

  destroy () {
    this.renderer.destroy()
    this.camera.destroy()
    this.input.destroy()
    this.navMesh.destroy()
  }
}

export {
  World,
  Entity,
  Component,
  Resources
}
