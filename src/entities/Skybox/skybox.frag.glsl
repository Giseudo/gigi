varying vec3 vWorldPosition;
varying vec2 vUv;
uniform vec3 skyColor;
uniform vec3 groundColor;

void main() {
  float fog = vWorldPosition.y;
  fog += 100.;
  fog /= 200.;
  fog = clamp(fog, 0., 1.);

  vec3 color = mix(groundColor, skyColor, fog);

  gl_FragColor = vec4(color, 1.0);
}
