uniform vec3 color;
uniform vec3 fogColor;
uniform sampler2D tMatcap;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vEye;
varying vec2 vUv;
varying vec2 vN;

float frac(float v) {
  return v - floor(v);
}

void main() {
  float top = dot(vWorldNormal, vec3(0, 1, 0));
  top += .5;
  top = clamp(top, 0., 1.);

  float fog = vWorldPosition.y;
  fog += 30.;
  fog /= 30.;
  fog = clamp(fog, 0., 1.);

  vec4 matcapTex = texture2D(tMatcap, vN);
  vec3 blend = mix(fogColor, matcapTex.rgb, fog);

  gl_FragColor = vec4(blend, 1.0);
}
