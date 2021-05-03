uniform vec3 baseColor;
uniform vec3 fogColor;
uniform sampler2D tColor;
uniform int pass;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  if (pass > 0) return;

  float fog = vWorldPosition.y;
  fog += 100.;
  fog /= 90.;
  fog = clamp(fog, 0., 1.);
  fog = pow(fog, 2.);

  vec3 N = normalize(vWorldNormal);
  float shadow = dot(N, vec3(0., -1., 0.)) * .2;
  shadow += dot(N, vec3(-1., 0, 0.)) * .1;
  shadow += dot(N, vec3(0., 0, -1.)) * .05;

  vec3 blend = baseColor - shadow;
  // blend = mix(fogColor, blend, fog);

  vec3 tint = texture2D(tColor, vUv).rgb;
  blend *= tint;

  gl_FragColor = vec4(blend, 1.0);
}
