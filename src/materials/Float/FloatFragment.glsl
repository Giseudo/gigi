uniform vec3 baseColor;
uniform vec3 fogColor;
uniform int pass;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  if (pass > 0) return;

  float fog = vWorldPosition.y;
  fog += 100.;
  fog /= 100.;
  fog = clamp(fog, 0., 1.);
  fog = pow(fog, 2.);

  float shadow = 1.0 - (vWorldNormal.r + vWorldNormal.g + vWorldNormal.b);
  vec3 blend = baseColor - shadow * .1;
  blend = mix(fogColor, blend, fog);

  gl_FragColor = vec4(blend, 1.0);
}
