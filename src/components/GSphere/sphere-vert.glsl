varying vec3 viewDir;
varying vec3 worldNormal;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  viewDir = worldPosition.xyz - cameraPosition;
  worldNormal = normal;

  gl_Position = projectedPosition;
}

