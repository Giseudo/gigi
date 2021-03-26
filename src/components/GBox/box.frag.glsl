uniform vec3 color;

varying vec3 vNormal;

float frac(float v) {
  return v - floor(v);
}

void main() {
  float top = dot(vNormal, vec3(0, 1, 0));
  top = clamp(top, 0., 1.);
  top += .5;

  gl_FragColor = vec4(color * top, 1.0);
}
