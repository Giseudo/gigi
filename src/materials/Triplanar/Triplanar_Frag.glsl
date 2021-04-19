uniform sampler2D tNoise;
uniform sampler2D tTop;
uniform sampler2D tSide;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vWorldNormal;

float normalRepeat = 1.;
float noiseBlending = .2;

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
  float xnoise = texture2D(tNoise, vPos.yz * normalRepeat).r;
  float ynoise = texture2D(tNoise, vPos.xz * normalRepeat).r;
  float znoise = texture2D(tNoise, vPos.xy * normalRepeat).r;

  vec3 blending = abs(vWorldNormal.xyz);
  blending /= dot(blending, vec3(1.));

  // Height value from each plane's texture. This is usually
  // packed in to another texture or (less optimally) as a separate
  // texture.
  vec3 heights = vec3(xnoise, ynoise, znoise) + (blending * 3.0);
  float height_start = max(max(heights.x, heights.y), heights.z) - noiseBlending;
  vec3 h = max(heights - vec3(height_start), vec3(0.,0.,0.));
  blending = h / dot(h, vec3(1.,1.,1.));

  vec3 xaxis = texture2D( tSide, vPos.yz * normalRepeat).rgb;
  vec3 yaxis = texture2D( tTop, vPos.xz * normalRepeat / 4.).rgb;
  vec3 zaxis = texture2D( tSide, vPos.xy * normalRepeat).rgb;

  vec3 color = xaxis * blending.x + yaxis * blending.y + zaxis * blending.z;

  gl_FragColor = vec4(color, 1);
}

