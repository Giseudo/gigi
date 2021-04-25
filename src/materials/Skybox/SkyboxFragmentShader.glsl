varying vec3 vWorldPosition;
uniform vec3 skyColor;
uniform vec3 groundColor;

#define PI 3.14159265359

void main() {
  float fog = vWorldPosition.y;
  fog += 100.;
  fog /= 400.;
  fog = clamp(fog, 0., 1.);

  vec3 color = mix(groundColor, skyColor, fog);

  gl_FragColor = vec4(color, 1.0);
}
