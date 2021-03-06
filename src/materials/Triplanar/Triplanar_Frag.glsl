uniform sampler2D tNoise;
uniform sampler2D tTop;
uniform sampler2D tSide;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vWorldNormal;

float normalRepeat = 1.;
float noiseBlending = 1.;

vec3 getTriPlanarBlend(vec3 normal){
  vec3 blend = vec3(0.);
  vec2 xzBlend = abs(normalize(normal.xz));
  blend.xz = max(vec2(0.), xzBlend - 0.67);
  blend.xz /= max(0.00001, dot(blend.xz, vec2(1.,1.)));
  blend.y = saturate((abs(normal.y) - .67) * 10.0);
  blend.xz *= (1. - blend.y);

  return blend;
}

void main(){
  float xnoise = texture2D(tNoise, vPos.yz * normalRepeat / 2.).r;
  float ynoise = texture2D(tNoise, vPos.xz * normalRepeat / 2.).r;
  float znoise = texture2D(tNoise, vPos.xy * normalRepeat / 2.).r;

  vec3 blending = abs(vWorldNormal.xyz);

  // Height value from each plane's texture. This is usually
  // packed in to another texture or (less optimally) as a separate
  // texture.
  vec3 heights = vec3(xnoise, ynoise, znoise) + (blending * 2.0);
  float height_start = max(max(heights.x, heights.y), heights.z) - noiseBlending;
  vec3 h = max(heights - vec3(height_start), vec3(0.,0.,0.));
  if (h.x < .9) h.x = 0.;
  if (h.y < .9) h.y = 0.;
  if (h.z < .9) h.z = 0.;
  blending = h / dot(h, vec3(1.,1.,1.));

  vec3 xaxis = texture2D( tSide, vPos.yz * normalRepeat / 4.).rgb;
  vec3 yaxis = texture2D( tTop, vPos.xz * normalRepeat / 4.).rgb;
  vec3 zaxis = texture2D( tSide, vPos.xy * normalRepeat / 4.).rgb;

  vec3 color = xaxis * blending.x + yaxis * blending.y + zaxis * blending.z;

  gl_FragColor = vec4(color, 1);
}

