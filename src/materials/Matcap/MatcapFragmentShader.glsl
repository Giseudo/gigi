uniform vec3 fogColor;
uniform vec3 color;
uniform sampler2D tMatcap;
uniform int pass;

varying vec3 vWorldPosition;
varying vec2 vN;

float frac(float v) {
  return v - floor(v);
}

void main() {
  if (pass > 0) return;

  float fog = vWorldPosition.y;
  fog += 100.;
  fog /= 100.;
  fog = clamp(fog, 0., 1.);
  fog = pow(fog, 2.);

  vec4 matcapTex = texture2D(tMatcap, vN);
  vec3 blend = mix(fogColor, matcapTex.rgb, fog);

  gl_FragColor = vec4(blend * color, 1.0);
}
