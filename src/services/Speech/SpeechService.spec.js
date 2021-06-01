import { expect } from 'chai'
import DialogueService from './DialogueService.ts'
import { Object3D } from 'three'
import { Camera } from '../../engine/Camera'

describe('DialogueService', () => {
  const service = new DialogueService({ camera: new Camera(500, 500) })

  describe('speech balloons', () => {
    const object = new Object3D()

    it('should show a speech balloon', () => {
      service.showSpeechBalloon(object, 'Lorem ipsum dolor sit amet')

      expect(service.getBalloon(object)).to.not.be.undefined
    })

    it('should hide a speech balloon', () => {
      service.hideSpeechBalloon(object)

      expect(service.getBalloon(object)).to.be.undefined
    })
  })
})
