uniform sampler2D tDiffuse;
varying vec2 vUv;

vec2 distort(vec2 uv, float scale, float distortion, float cubicDistortion)
{ 
  vec2 h = uv - vec2(0.5, 0.5);
  float r2 = h.x * h.x + h.y * h.y;

  float f = 1.0 + r2 * (distortion + cubicDistortion * sqrt(r2));

  return vec2(f * scale * h.x + .5, f * scale * h.y + .5);
}

vec2 curveRemapUV(vec2 uv)
{
  vec2 curvature = vec2(3., 3.);
  // as we near the edge of our screen apply greater distortion using a sinusoid.

  uv = uv * 2.0 - 1.0;
  vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
  uv = uv + uv * offset * offset;
  uv = uv * 0.5 + 0.5;
  return uv;
}

void main() {
  /*float s = .8;
  float d = .0;
  float k = .5;


  vec2 redUv = distort(vUv, s + offset, d + offset, k);
  vec2 greenUv = distort(vUv, s, d, k);
  vec2 blueUv = distort(vUv, s - offset, d - offset, k);

  float red = texture(tDiffuse, redUv).r;
  float green = texture(tDiffuse, greenUv).g;
  float blue = texture(tDiffuse, blueUv).b;*/

  float offset = vUv.x - .5;
  offset = abs(offset);
  offset *= -.01;

  vec2 redUv = curveRemapUV(vec2(vUv.x + offset, vUv.y + offset));
  vec2 greenUv = curveRemapUV(vec2(vUv.x, vUv.y));
  vec2 blueUv = curveRemapUV(vec2(vUv.x - offset, vUv.y - offset));

  float red = texture(tDiffuse, redUv).r;
  float green = texture(tDiffuse, greenUv).g;
  float blue = texture(tDiffuse, blueUv).b;

  float vignet = 1.0 - distance(vUv - .5, vec2(0.));
  vignet = pow(vignet, .8);
  vignet = clamp(0.0, 1.0, vignet);

  if (greenUv.x < 0.0 || greenUv.y < 0.0 || greenUv.x > 1.0 || greenUv.y > 1.0){
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = vec4(
      red * vignet,
      green * vignet,
      blue * vignet,
      1.0
    );
  }
}
