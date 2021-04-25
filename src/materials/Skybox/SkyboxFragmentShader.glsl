varying vec3 vWorldPosition;
uniform vec3 skyColor;
uniform vec3 groundColor;

#define PI 3.14159265359

void main() {
  float fog = vWorldPosition.y;
  fog += 80.;
  fog /= 600.;
  fog = clamp(fog, 0., 1.);

  vec3 pct = vec3(fog);
  pct.r = sin(fog * PI * 2.);
  pct.g *= .9;
  pct.b = smoothstep(0., 1., fog * .9);

  vec3 color = mix(groundColor, skyColor, pct);

  float depth = clamp((vWorldPosition.y + 200.) / 300., 0., 1.);
  color = mix(vec3(0.), color, depth);

  gl_FragColor = vec4(color, 1.0);
}
