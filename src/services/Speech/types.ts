import { Object3D, Vector3 } from "three"
import { Camera } from '@/engine'

export type SpeechBalloon = {
  object: Object3D,
  screenPosition: Vector3,
  text: string
}

export type SpeechBalloons = {
  [key: string]: SpeechBalloon
}

export type SpeechServiceState = {
  balloons: SpeechBalloons
}

export type SpeechServiceDependencies = {
  camera: Camera
}

export const SpeechServiceSymbol = Symbol()
