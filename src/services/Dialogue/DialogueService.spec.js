import { expect } from 'chai'
import { showSpeechBalloon, hideSpeechBalloon, balloons } from './DialogueService.ts'
import { Object3D } from 'three'

describe('DialogueService', () => {
  describe('speech balloons', () => {
    const object = new Object3D()

    it('should show a speech balloon', () => {
      showSpeechBalloon(object, 'Lorem ipsum dolor sit amet')

      expect(balloons[object.id]).to.not.be.undefined
    })

    it('should hide a speech balloon', () => {
      hideSpeechBalloon(object)

      expect(balloons[object.id]).to.be.undefined
    })
  })
})
