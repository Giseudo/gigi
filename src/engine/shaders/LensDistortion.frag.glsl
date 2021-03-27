uniform sampler2D tDiffuse;
varying vec2 vUv;

vec2 distort(vec2 uv, float scale, float distortion, float cubicDistortion)
{ 
  vec2 h = uv - vec2(0.5, 0.5);
  float r2 = h.x * h.x + h.y * h.y;

  float f = 1.0 + r2 * (distortion + cubicDistortion * sqrt(r2));

  return vec2(f * scale * h.x + .5, f * scale * h.y + .5);
}

void main() {
  float s = .8;
  float d = .0;
  float k = .7;

  float offset = vUv.x - .5;
  offset = abs(offset);
  offset *= -.02;

  vec2 redUv = distort(vUv, s + offset, d + offset, k);
  vec2 greenUv = distort(vUv, s, d, k);
  vec2 blueUv = distort(vUv, s - offset, d - offset, k);

  float red = texture(tDiffuse, redUv).r;
  float green = texture(tDiffuse, greenUv).g;
  float blue = texture(tDiffuse, blueUv).b;

  float vignet = 1.0 - distance(vUv - .5, vec2(0.));
  vignet = pow(vignet, .8);
  vignet = clamp(0.0, 1.0, vignet);
  // vignet = 1.0;

  gl_FragColor = vec4(
    red * vignet,
    green * vignet,
    blue * vignet,
    1.0
  );
}
