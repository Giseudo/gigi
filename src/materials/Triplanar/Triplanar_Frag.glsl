uniform sampler2D tNoise;
uniform sampler2D tTop;
uniform sampler2D tSide;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vWorldNormal;

float normalRepeat = 1.;
float normalScale = .2;

vec3 getTriPlanarBlend(vec3 normal){
  vec3 blend = vec3(0.);
  vec2 xzBlend = abs(normalize(normal.xz));
  blend.xz = max(vec2(0.), xzBlend - 0.67);
  blend.xz /= max(0.00001, dot(blend.xz, vec2(1.,1.)));
  blend.y = saturate((abs(normal.y) - 0.675) * 80.0);
  blend.xz *= (1. - blend.y);

  return blend;
}

void main(){
  vec3 blending = getTriPlanarBlend(vWorldNormal);

  vec3 xaxis = texture2D( tSide, vPos.yz * normalRepeat).rgb;
  vec3 yaxis = texture2D( tTop, vPos.xz * normalRepeat / 4.).rgb;
  vec3 zaxis = texture2D( tSide, vPos.xy * normalRepeat).rgb;

  vec3 color = xaxis * blending.x + yaxis * blending.y + zaxis * blending.z;


  gl_FragColor = vec4(color, 1);
}

