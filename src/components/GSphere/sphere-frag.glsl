varying vec3 viewDir;
varying vec3 worldNormal;

uniform vec3 color;

void main() {
  float intensity = 2.0;
  float fresnel = pow(1. + dot(normalize(viewDir), worldNormal), intensity);

  gl_FragColor = vec4(color, fresnel);
}

