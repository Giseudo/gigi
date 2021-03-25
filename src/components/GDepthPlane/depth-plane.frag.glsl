#include <packing>

varying vec2 vUv;
varying vec4 viewPos;

uniform vec3 color;
uniform mat4 uProjectionInverse;
uniform mat4 uMatrixWorld;
uniform vec2 uResolution;
uniform sampler2D tDepth;

float frac(float v) {
  return v - floor(v);
}

float readDepth( sampler2D depthSampler, vec2 coord ) {
  float cameraNear = .1;
  float cameraFar = 1000.;

  float fragCoordZ = texture2D( depthSampler, coord ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
  /*float normalizedDepth = unpackRGBAToDepth(texture2D(tDepth, screenPos));
  vec4 ndc = vec4(
    (vUv.x - 0.5) * 2.0,
    (vUv.y - 0.5) * 2.0,
    (normalizedDepth - 0.5) * 2.0,
    1.0 - sceneDepth
  );
  vec4 clip = uProjectionInverse * ndc;
  vec4 view = uMatrixWorld* (clip / clip.w);
  vec3 result = view.xyz;

  vec3 pd = ndc.xyz / ndc.w;
  float objDepth = pd.z * .5 + .5;*/

  vec2 screenPos = gl_FragCoord.xy / uResolution;
  screenPos *= .5;

  float sceneDepth = readDepth(tDepth, screenPos);
  float eyeDepth = -viewPos.b;

  float intersection = ((sceneDepth * 1000.) - eyeDepth) / 20.;

  gl_FragColor.rgb = color;
  gl_FragColor.a = intersection;
}

