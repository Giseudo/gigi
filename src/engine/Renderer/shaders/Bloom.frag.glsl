uniform sampler2D tDiffuse;
uniform sampler2D tBloom;
varying vec2 vUv;

void main() {
  vec4 diffuse = texture2D(tDiffuse, vUv);
  vec4 bloom = texture2D(tBloom, vUv);
  bloom -= .5;
  bloom = saturate(bloom);

  gl_FragColor = diffuse + bloom;
}
