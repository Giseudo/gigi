varying vec3 vPos;
varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vUv = uv;
  vPos = localPosition.rgb;
  vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal).rgb;

  gl_Position = projectedPosition;
}

