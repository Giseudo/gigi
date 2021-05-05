uniform float time;
uniform vec3 baseColor;
uniform vec3 fogColor;
uniform sampler2D tColor;
uniform int pass;
varying vec2 vUv;

void main() {
  vec3 blend = vec3(1., 0., 0.);

  gl_FragColor = vec4(blend, 1.0);
}
