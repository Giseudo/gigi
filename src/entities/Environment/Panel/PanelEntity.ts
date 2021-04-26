import { Object3D, ShaderMaterial, Texture, NearestFilter, CustomBlending, OneFactor } from 'three'
import { Entity, Resources, Time } from '@/engine'
import { PanelFragment, PanelVertex } from './'

export default class PanelEntity extends Entity {
  async start(): Promise<void> {
    const panel: Object3D = await Resources.loadObject(require('./PanelModel.fbx').default)

    const color: Texture = await Resources.loadTexture(require('./PanelColor.png'))
    color.minFilter = NearestFilter

    const panelMaterial = new ShaderMaterial({
      vertexShader: PanelVertex,
      fragmentShader: PanelFragment,
      uniforms: {
        tColor: { value: color },
        time: Time.time
      },
      blending: CustomBlending,
      blendDst: OneFactor,
      blendSrc: OneFactor,
      transparent: true
    })

    panel.traverse((node: any) => {
      if (node.isMesh)
        node.material = panelMaterial
    })

    this.add(panel)
  }
}
