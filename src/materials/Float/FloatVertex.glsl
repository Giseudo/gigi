varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;

uniform float time;
attribute vec3 color;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;

  if (color.r > 0.) worldPosition.x += sin(modelMatrix[0].x * 20. + time * .5) * 2.;
  if (color.g > 0.) worldPosition.z += sin(modelMatrix[0].x * 20. + time * .5) * 2.;
  if (color.b > 0.) worldPosition.y += sin(modelMatrix[0].x * 20. + time * .5) * 2.;

  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vUv = uv;
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(normalMatrix * normal);

  gl_Position = projectedPosition;
}

