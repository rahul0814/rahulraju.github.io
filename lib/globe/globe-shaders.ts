export const planetSurfaceVertexShader = `
varying vec3 v_worldPos;
varying vec3 v_normal;
varying vec3 v_modelPos;
varying vec2 v_uv;

void main() {
  v_uv = uv;
  v_modelPos = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  v_worldPos = worldPos.xyz;
  v_normal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const planetSurfaceFragmentShader = `
varying vec3 v_worldPos;
varying vec3 v_normal;
varying vec3 v_modelPos;
varying vec2 v_uv;

uniform float u_time;
uniform vec3 u_lightPosition;
uniform vec3 u_colorOcean;
uniform vec3 u_colorOceanShallow;
uniform vec3 u_colorLand;
uniform vec3 u_colorLandHigh;
uniform vec3 u_colorAtmosphere;
uniform vec3 u_colorTwilight;
uniform float u_hover;
uniform vec3 u_cursor;

// Simplex 3D noise functions for procedural terrain and continents
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p);
    p *= 2.08;
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec3 sphereCoord = normalize(v_modelPos);

  // Continental mass noise
  float continent = fbm(sphereCoord * 2.2);
  float isLand = smoothstep(0.04, 0.14, continent);

  // Ocean color gradient: deep ocean to shallow shelves
  vec3 ocean = mix(u_colorOcean, u_colorOceanShallow, smoothstep(-0.4, 0.04, continent));

  // Land color gradient: coastal dark terrain to elevated plateaus
  vec3 land = mix(u_colorLand, u_colorLandHigh, smoothstep(0.14, 0.45, continent));

  // Base planetary surface
  vec3 surface = mix(ocean, land, isLand);

  // Vector lighting
  vec3 N = normalize(v_normal);
  vec3 V = normalize(cameraPosition - v_worldPos);
  vec3 L = normalize(u_lightPosition - v_worldPos);
  vec3 H = normalize(V + L);

  float NdL = dot(N, L);
  float dayFactor = smoothstep(-0.25, 0.35, NdL);
  float nightFactor = 1.0 - dayFactor;

  // Specular reflection on water
  float oceanSpec = pow(max(0.0, dot(H, N)), 34.0) * (1.0 - isLand) * smoothstep(0.0, 0.35, NdL);

  // Subtle procedural cloud cover drifting slowly
  vec3 cloudCoord = sphereCoord * 3.2 + vec3(u_time * 0.015, u_time * 0.008, 0.0);
  float cloudNoise = fbm(cloudCoord);
  float cloud = smoothstep(0.18, 0.52, cloudNoise) * 0.42;
  surface = mix(surface, vec3(0.75, 0.88, 1.0), cloud * dayFactor);

  // Twilight Rayleigh scattering band along terminator line
  float twilight = smoothstep(0.25, -0.05, abs(NdL + 0.06)) * 0.65;

  // Night side city & data grid lights on land
  float cityNoise = snoise(sphereCoord * 16.0);
  float city = step(0.66, cityNoise) * isLand * nightFactor * 0.85;
  vec3 cityLightColor = vec3(0.35, 0.85, 1.0) * city;

  // Atmospheric Fresnel glow hugging the silhouette
  float fresnel = pow(1.0 - max(0.0, dot(V, N)), 2.6);
  vec3 rimGlow = u_colorAtmosphere * fresnel * (0.35 + 0.65 * dayFactor);

  // Interactive cursor hover highlight
  float cursorDist = length(v_modelPos - u_cursor);
  float hoverLight = u_hover * (1.0 - smoothstep(0.0, 1.8, cursorDist)) * 0.4;

  // Combine lighting components
  vec3 litColor = surface * (0.05 + 0.95 * dayFactor);
  litColor += u_colorTwilight * twilight;
  litColor += cityLightColor;
  litColor += vec3(1.0) * oceanSpec * 0.85;
  litColor += rimGlow * 1.25;
  litColor += u_colorAtmosphere * hoverLight;

  gl_FragColor = vec4(litColor, 1.0);
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
}
`;

export const atmosphereHaloVertexShader = `
varying vec3 v_worldNormal;
varying vec3 v_worldPos;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  v_worldPos = worldPos.xyz;
  v_worldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const atmosphereHaloFragmentShader = `
varying vec3 v_worldNormal;
varying vec3 v_worldPos;

uniform vec3 u_lightPosition;
uniform vec3 u_colorAtmosphere;
uniform vec3 u_colorOuter;
uniform float u_intensity;

void main() {
  vec3 V = normalize(cameraPosition - v_worldPos);
  vec3 N = normalize(v_worldNormal);

  // With BackSide rendering, normals point inwards.
  // dot(V, -N) peaks at the outer edge of the sphere where surface curves away
  float rim = pow(max(0.0, dot(V, -N)), 2.5);

  vec3 L = normalize(u_lightPosition - v_worldPos);
  float sunFacing = 0.45 + 0.55 * max(0.0, dot(L, -N));

  vec3 color = mix(u_colorOuter, u_colorAtmosphere, rim * 0.85);
  float alpha = rim * sunFacing * u_intensity * 0.95;

  gl_FragColor = vec4(color * 1.5, alpha);
}
`;

export const ringVertexShader = `
varying vec3 v_localPos;
varying vec3 v_worldPos;
varying vec2 v_uv;

void main() {
  v_uv = uv;
  v_localPos = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  v_worldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const ringFragmentShader = `
varying vec3 v_localPos;
varying vec3 v_worldPos;
varying vec2 v_uv;

uniform sampler2D u_ringTexture;
uniform float u_ringOffset;
uniform float u_innerRadius;
uniform float u_outerRadius;
uniform vec3 u_lightPosition;
uniform float u_opacity;

const float PI = 3.14159265358979323846;

void main() {
  float r = length(v_localPos.xy);
  float angle = atan(v_localPos.y, v_localPos.x); // [-PI, PI]

  // Map polar coordinates into seamless 0..1 UVs
  float u = fract((angle / (2.0 * PI)) + 0.5 + u_ringOffset);
  float v = clamp((r - u_innerRadius) / (u_outerRadius - u_innerRadius), 0.0, 1.0);

  vec4 tex = texture2D(u_ringTexture, vec2(u, v));

  // Soft feathering at the inner and outer boundary edges of the ring
  float edgeFeather = smoothstep(0.0, 0.16, v) * smoothstep(1.0, 0.84, v);

  // Soft ambient orbital track line glow
  vec3 trackGlow = mix(vec3(0.22, 0.55, 0.95), vec3(0.68, 0.35, 0.85), v) * 0.14 * edgeFeather;

  vec3 textCol = tex.rgb * vec3(1.15, 1.2, 1.3);
  vec3 finalColor = textCol + trackGlow;
  float finalAlpha = max(tex.a * 1.35, 0.06) * edgeFeather * u_opacity;

  // Directional lighting modulation across the ring disc
  vec3 L = normalize(u_lightPosition - v_worldPos);
  float lighting = 0.55 + 0.45 * max(0.0, dot(vec3(0.0, 0.0, 1.0), L));

  gl_FragColor = vec4(finalColor * lighting, finalAlpha);
}
`;

export const orbVertexShader = `
varying vec3 v_worldPos;
varying vec3 v_worldNormal;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  v_worldPos = worldPosition.xyz;
  v_worldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export const orbFragmentShader = `
varying vec3 v_worldPos;
varying vec3 v_worldNormal;

uniform vec3 u_color;
uniform vec3 u_lightPosition;
uniform float u_intensity;

void main() {
  vec3 N = normalize(v_worldNormal);
  vec3 V = normalize(cameraPosition - v_worldPos);
  vec3 L = normalize(u_lightPosition - v_worldPos);
  vec3 H = normalize(V + L);

  float NdV = max(0.0, dot(N, V));
  float NdL = max(0.0, dot(N, L));
  float fresnel = pow(1.0 - NdV, 3.0);
  float spec = pow(max(0.0, dot(H, N)), 220.0);

  vec3 color = u_color * (0.35 + 0.65 * NdL);
  color += u_color * pow(NdV, 1.6) * 1.4;
  color += mix(u_color, vec3(1.0), 0.65) * fresnel * 1.8;
  color += vec3(1.0) * spec * 0.9;
  color *= u_intensity;

  gl_FragColor = vec4(color, 1.0);
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
}
`;
