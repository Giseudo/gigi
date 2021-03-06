uniform float power;
uniform float time;
uniform vec3 color;
uniform int pass;
uniform bool bloom;

varying vec3 vWorldNormal;
varying vec3 vViewDirection;

void main() {
  if (pass > 0 && !bloom) return;

  float fresnel = .5 * pow(dot(vViewDirection, vWorldNormal), power);
  fresnel = saturate(fresnel);
  fresnel += .5;

  float blink = pow(sin(time * 3.) * .5 + .5, .25) * .2;

  vec3 blend = color * fresnel;
  blend += blink * fresnel;

  gl_FragColor = vec4(blend, 1.0);
}
