varying vec2 vUv;
varying vec3 pos;
varying float sdf;
// varying vec4 mvPosition;

uniform float time;
uniform float amplitude;
uniform float frequency;
uniform float speed;
uniform float timeOffset;
uniform float pointSize;

float frac(float v) {
  return v - floor(v);
}

void main() {
  float sdf = distance(position.xy, vec2(0, 0));
  sdf += sin(sdf * frequency);
  float offset = (1. + sin(timeOffset + sdf + time * speed) * .5) * amplitude;

  vec4 localPosition = vec4(position, 1.);
  localPosition += vec4((normal * (amplitude + offset)), 1.);

  vec4 worldPosition = modelMatrix * localPosition;
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  pos = localPosition.xyz;
  // mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = pointSize;
  gl_Position = projectedPosition;
}

