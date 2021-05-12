uniform sampler2D tDiffuse;
uniform sampler2D tBloom;
uniform int pass;

varying vec2 vUv;

void main() {
  vec3 color = vec3(0.);

  if (pass == 0) color = texture2D(tDiffuse, vUv).rgb;
  if (pass == 1) color = texture2D(tBloom, vUv).rgb;

  gl_FragColor = vec4(color, 1.0);
}
