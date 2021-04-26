uniform sampler2D tColor;
uniform float time;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(tColor, vUv);

  vec4 color2 = color * (sin(time * 10.) * .5 + .5);
  color += color2 * 1.;

  gl_FragColor = color;
}
