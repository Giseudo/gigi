uniform float power;
uniform vec3 firstColor;
uniform vec3 secondColor;

varying vec3 vWorldNormal;
varying vec3 vViewDirection;

void main() {
  float bias = 0.2;
  float fresnel = bias * pow(dot(vViewDirection, vWorldNormal), power);

  vec3 color = mix(firstColor, secondColor, fresnel);

  gl_FragColor = vec4(color, 1.0);
}
