varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;

uniform float time;
attribute vec3 color;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vUv = uv;
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(normalMatrix * normal);

  if (color.b > 0.)
    projectedPosition.y += sin(modelMatrix[0].x * 20. + time * .5) * 5.;

  gl_Position = projectedPosition;
}

