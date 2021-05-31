import { Component, Entity } from "@/engine"

class Speaker extends Component {
  speaking: boolean = false

  constructor(entity: Entity) {
    super(entity)
  }

  speak(text: string) {
    this.speaking = true
  }

  shutUp() {
    this.speaking = false
  }
}

export default Speaker
