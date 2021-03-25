varying vec2 vUv;
varying vec3 viewDir;
varying vec3 worldNormal;
varying vec4 viewPos;

uniform vec3 color;
float frac(float v) {
  return v - floor(v);
}

void main() {
  float top = dot(worldNormal, vec3(0, 1, 0));
  top = clamp(top, 0., 1.);
  top += .5;

  gl_FragColor = vec4(color * top, 1.0);
}

