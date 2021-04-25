uniform vec3 fogColor;
uniform sampler2D tMatcap;

varying vec3 vWorldPosition;
varying vec2 vN;

float frac(float v) {
  return v - floor(v);
}

void main() {
  float fog = vWorldPosition.y;
  fog += 100.;
  fog /= 100.;
  fog = clamp(fog, 0., 1.);
  fog = pow(fog, 2.);

  vec4 matcapTex = texture2D(tMatcap, vN);
  vec3 color = mix(fogColor, matcapTex.rgb, fog);

  gl_FragColor = vec4(color, 1.0);
}
