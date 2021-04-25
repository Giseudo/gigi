varying vec3 vWorldNormal;
varying vec3 vViewDirection;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal).rgb;
  vViewDirection = worldPosition.xyz - cameraPosition;

  gl_Position = projectedPosition;
}

