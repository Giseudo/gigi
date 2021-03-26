varying vec3 viewDir;
varying vec3 worldNormal;

uniform float time;
uniform vec3 color;

void main() {
  float intensity = 1.0;
  float fresnel = pow(1. + dot(normalize(viewDir), worldNormal), intensity);

  fresnel += .3;
  fresnel *= (1. + sin(time * 5.)) * .5;

  gl_FragColor = vec4(color * fresnel, .2 + fresnel);
}

