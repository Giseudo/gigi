import { Renderer } from "@/engine"
import { ShaderMaterial, Texture } from "three"
import { BasicFragment, BasicVertex } from "./"

class BasicMaterial extends ShaderMaterial {
  fragmentShader: string = BasicFragment
  vertexShader: string = BasicVertex

  constructor (color: Texture, emission?: Texture) {
    super()

    this.uniforms = {
      tDiffuse: { value: color },
      tBloom: { value: emission },
      pass: Renderer.currentPass
    }
  }
}

export default BasicMaterial
