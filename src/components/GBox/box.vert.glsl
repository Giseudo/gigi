varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vEye;
varying vec2 vUv;
varying vec2 vN;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vNormal = normal;
  vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
  vWorldPosition = worldPosition.xyz;

  vec3 e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
  vec3 n = normalize( normalMatrix * normal );

  vec3 r = reflect( e, n );
  float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
  vN = r.xy / m + .5;

  gl_Position = projectedPosition;
}

