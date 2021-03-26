varying vec3 pos;
// varying vec4 mvPosition;
uniform vec3 color;
uniform float amplitude;
uniform float frequency;
uniform float speed;
uniform float deltaTime;

float frac(float v) {
  return v - floor(v);
}

void main() {
  if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

  // float c = min(.8, .5 - pos.z);

  // float c = pow(length(mvPosition / 20.), 5.0);

  float c = distance(vec2(pos.x, pos.y), vec2(.0,.0));
  c /= 400.;
  //c = pow(c, 3.);
  gl_FragColor = vec4(color * c, 1.);
}

