varying vec3 vWorldNormal;
varying vec3 vViewDirection;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vWorldNormal = normalize(mat3(normalMatrix[0].xyz, normalMatrix[1].xyz, normalMatrix[2].xyz) * normal).rgb;
  // vWorldNormal = normalize(normalMatrix * normal);
  vViewDirection = normalize(-worldPosition.xyz);

  gl_Position = projectedPosition;
}

