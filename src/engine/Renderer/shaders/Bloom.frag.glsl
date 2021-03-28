uniform sampler2D tDiffuse;
uniform sampler2D tBloom;
varying vec2 vUv;

void main() {
  // gl_FragColor = vec4(texture(tBloom, vUv).rgb, 1.0);
  gl_FragColor = (texture2D(tDiffuse, vUv) + vec4(1.0) * texture2D(tBloom, vUv));
}
