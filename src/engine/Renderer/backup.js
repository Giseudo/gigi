import { reactive, readonly } from 'vue'
import { FloatNode } from 'three/examples/jsm/nodes/Nodes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { camera, orthoCam } from '@/engine/camera'
import { scene } from '@/engine/scene'
import { TextureLoader,
  Matrix4,
  WebGLRenderTarget,
  LinearFilter,
  NearestFilter,
  RGBFormat,
  DepthFormat,
  DepthTexture,
  UnsignedShortType,
  Vector2,
  Vector3,
  WebGLRenderer,
  Clock,
  EventDispatcher,
  CineonToneMapping,
  OrthographicCamera,
  Scene,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  PlaneGeometry,
  Mesh
} from 'three'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import * as types from './types'

const state = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  time: new FloatNode(0.0),
  deltaTime: new FloatNode(0.0),
  depthTexture: {
    value: null
  },
  viewMatrixInverse: {
    type: 'm4',
    value: camera.matrixWorldInverse
  },
  uProjectionInverse: {
    type: 'm4',
    value: new Matrix4()
  },
  uMatrixWorld: {
    type: 'm4',
    value: new Matrix4()
  },
  uResolution: {
    type: 'v2',
    value: new Vector2()
  }
})


const Events = new EventDispatcher()
const clock = new Clock()
const interval = 1 / 60

export const renderer = new WebGLRenderer({ antialias: false })
// renderer.autoClear = false
renderer.setClearColor(0x252428)
renderer.setSize(state.width, state.height)
renderer.shadowMap.enabled = true
renderer.setPixelRatio(window.devicePixelRatio)
renderer.toneMapping = CineonToneMapping
renderer.toneMappingExposure = 1

// render texture 
const target = new WebGLRenderTarget(state.width, state.height)
target.texture.format = RGBFormat
target.texture.minFilter = LinearFilter
target.texture.magFilter = LinearFilter
target.texture.generateMipmaps = false
target.stencilBuffer = false
target.depthBuffer = true
target.depthTexture = new DepthTexture()
target.depthTexture.format = DepthFormat
target.depthTexture.type = UnsignedShortType

// fx
const composer = new EffectComposer(renderer)
const fxScene = new Scene()
const fxCamera = new OrthographicCamera()

composer.addPass(new RenderPass(scene, camera))

// fs triangle
const triangleGeo = new BufferGeometry()
const vertices = new Float32Array([
  -1.0, -1.0,
  3.0, -1.0,
  -1.0, 3.0
]);

triangleGeo.setAttribute('position', new BufferAttribute(vertices, 2))

const material = new ShaderMaterial({
  vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    #include <packing>

    uniform vec2 resolution;
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;

    float readDepth( sampler2D depthSampler, vec2 coord ) {
      float cameraNear = .1;
      float cameraFar = 1000.;

      float fragCoordZ = texture2D( depthSampler, coord ).x;
      float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
      return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec3 color = texture2D(tDiffuse, uv).rgb;
      float depth = readDepth(tDepth, uv);

      // gl_FragColor = vec4(1.0 - vec3(pow(depth, .1)), 1.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    tDiffuse: { value: target.texture },
    tDepth: { value: target.depthTexture },
    resolution: { value: new Vector2(state.width, state.height) }
  }
})

const depthPass = new ShaderPass(material)
composer.addPass(depthPass)

const triangle = new Mesh(triangleGeo, material)
triangle.frustumCulled = false
fxScene.add(triangle)

export default {
  target, 

  state: readonly(state),

  init: (el, options) => {
    Events.dispatchEvent({ type: types.START })

    el.appendChild(renderer.domElement)

    renderer.setAnimationLoop(() => {
      state.deltaTime.value += clock.getDelta()

      const deltaTime = state.deltaTime.value

      if (deltaTime > interval) {

        Events.dispatchEvent({ type: types.UPDATE, deltaTime })

        renderer.setRenderTarget(target)
        renderer.render(scene, camera)

        composer.render(deltaTime)

        Events.dispatchEvent({ type: types.DRAW })

        state.time.value += state.deltaTime.value
        state.deltaTime.value %= interval
      }
    })
  },

  setSize: (width, height) => {
    state.width = width
    state.height = height
    renderer.setSize(width, height)
    target.setSize(width, height)
    material.uniforms.uResolution.value.x = width / 2
    material.uniforms.uResolution.value.y = height / 2
  },

  destroy: () => {
    renderer.setAnimationLoop(null)
  },

  subscribe: (topic, callback) => {
    Events.addEventListener(topic, callback)
  },

  unsubscribe: (topic, callback) => {
    Events.removeEventListener(topic, callback)
  }
}




// depthPass.uniforms.uProjectionInverse.value.copy(fxCamera.projectionMatrixInverse)
// depthPass.uniforms.uMatrixWorld.value.copy(fxCamera.matrixWorld)


/*const depthShader = {
  vertexShader: `
    precision highp float;
    attribute vec2 position;

    void main() {
      // gl_Position = vec4( (uv - 0.5)*2.0, 0.0, 1.0 );
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    #include <packing>

    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float cameraNear;
    uniform float cameraFar;

    uniform vec2 uResolution;

    uniform mat4 uProjectionInverse;
    uniform mat4 uMatrixWorld;

    float frac(float v) {
      return v - floor(v);
    }

    float readDepth( sampler2D depthSampler, vec2 coord ) {
      float fragCoordZ = texture2D( depthSampler, coord ).x;
      float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
      return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
    }

    vec3 computeWorldPosition() {
      float normalizedDepth = unpackRGBAToDepth(texture2D(tDepth, vUv));

      vec4 ndc = vec4(
        (vUv.x - 0.5) * 2.0,
        (vUv.y - 0.5) * 2.0,
        (normalizedDepth - 0.5) * 2.0,
        1.0
      );
      vec4 clip = uProjectionInverse * ndc;
      vec4 view = uMatrixWorld * (clip / clip.w);
      vec3 result = view.xyz;

      return result;
    }

    vec3 visualizePosition(in vec3 pos){
        float grid = 1.0;
        float width = 1.0;

        pos *= grid;

        // Detect borders with using derivatives.
        vec3 fw = fwidth(pos);
        vec3 bc = saturate(width - abs(1.0 - 2.0 * fract(pos)) / fw);

        // Frequency filter
        vec3 f1 = smoothstep(1.0 / grid, 2.0 / grid, fw);
        vec3 f2 = smoothstep(2.0 / grid, 4.0 / grid, fw);

        bc = mix(mix(bc, vec3(0.5), f1), vec3(0.0), f2);

        return bc;
    }

    void main() {
      // vec2 uv = gl_FragCoord.xy / uResolution.xy;
      // vec4 sceneColor = texture2D(tDiffuse, uv);
      gl_FragColor = vec4(1.,1.,1.,1.);

      // float depth = readDepth( tDepth, vUv );

      // float mask = frac(result.y);

      // gl_FragColor.rgb = color;
      // gl_FragColor.a = 1.0;

      // gl_FragColor = texture2D( tDiffuse, vUv );

      // vec3 worldPosition = computeWorldPosition();

      // vec3 sceneColor = texture2D( tDiffuse, vUv ).rgb;
      // gl_FragColor = vec4( sceneColor + visualizePosition(worldPosition), 1.0);
      // worldPosition.y = clamp(0., 1., worldPosition.y);

      // float mask = worldPosition.y;

      // vec3 color = mix(vec3(0.), sceneColor.rgb, mask);

      // gl_FragColor = vec4(vec3(color), 1.0);

    }
  `,
  uniforms: {
    cameraNear: { value: 0 },
    cameraFar: { value: 0 },
    tDiffuse: { value: null },
    tDepth: { value: null },
    uProjectionInverse: { value: new Matrix4() },
    uMatrixWorld: { value: new Matrix4() }
  }
}*/

// var depthPass = new ShaderPass(depthShader)
// depthPass.uniforms.cameraNear.value = camera.near
// depthPass.uniforms.cameraFar.value = camera.far
// depthPass.uniforms.tDepth.value = target.depthTexture
// depthPass.uniforms.uProjectionInverse = state.uProjectionInverse
// depthPass.uniforms.uMatrixWorld = state.uMatrixWorld
// composer.addPass(depthPass)

