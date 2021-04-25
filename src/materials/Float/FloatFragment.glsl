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

  vec3 N = normalize(vWorldNormal);
  float light = dot(N, vec3(0., 1., 0.)) * .2;
  light += dot(N, vec3(1., 0, 0.)) * .1;
  light += dot(N, vec3(0., 0, 1.)) * .05;

  vec3 blend = baseColor + light;
  blend = mix(fogColor, blend, fog);

  gl_FragColor = vec4(blend, 1.0);
}
