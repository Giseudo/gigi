uniform vec3 color;
uniform vec3 fogColor;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

float frac(float v) {
  return v - floor(v);
}

void main() {
  float top = dot(vWorldNormal, vec3(0, 1, 0));
  top += .5;
  top = clamp(top, 0., 1.);

  float fog = vWorldPosition.y;
  fog += 30.;
  fog /= 25.;
  fog = clamp(fog, 0., 1.);
  fog = 1.0 - fog;

  vec3 blend = mix(color * top, fogColor, fog);

  gl_FragColor = vec4(blend, 1.0);
}
