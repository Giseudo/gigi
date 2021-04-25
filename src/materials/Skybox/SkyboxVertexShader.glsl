varying vec3 vWorldPosition;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;
  // vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * worldPosition;

  vWorldPosition = worldPosition.xyz;

  gl_Position = projectedPosition;
}

