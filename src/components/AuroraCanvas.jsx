import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

/* ── Flowing gradient-mesh shader ──────────────────────────
   Three drifting colour fields blended with domain-warped
   noise. Deliberately low contrast, it sits behind the
   photography and never competes with it.                  */

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uAspect;
  uniform vec3  uA;
  uniform vec3  uB;
  uniform vec3  uC;
  uniform vec3  uBg;
  uniform float uIntensity;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  // soft radial field
  float field(vec2 uv, vec2 c, float r) {
    float d = length((uv - c) * vec2(uAspect, 1.0));
    return smoothstep(r, 0.0, d);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.055;

    // domain warp so the blobs breathe organically
    vec2 w = vec2(fbm(uv * 2.1 + t), fbm(uv * 2.1 - t + 4.7));
    vec2 p = uv + (w - 0.5) * 0.34;

    vec2 m = uMouse * 0.06;

    vec2 cA = vec2(0.24 + sin(t * 1.6) * 0.10, 0.30 + cos(t * 1.2) * 0.09) + m;
    vec2 cB = vec2(0.78 + cos(t * 1.1) * 0.11, 0.34 + sin(t * 1.5) * 0.10) - m;
    vec2 cC = vec2(0.52 + sin(t * 0.9) * 0.14, 0.82 + cos(t * 1.3) * 0.08) + m * 0.5;

    float fA = field(p, cA, 0.62);
    float fB = field(p, cB, 0.58);
    float fC = field(p, cC, 0.66);

    vec3 col = uBg;
    col = mix(col, uA, fA * uIntensity);
    col = mix(col, uB, fB * uIntensity);
    col = mix(col, uC, fC * uIntensity);

    // fine grain kills banding on wide gradients
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.016;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ palette, intensity }) {
  const ref = useRef();
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uA: { value: new THREE.Color(palette[0]) },
      uB: { value: new THREE.Color(palette[1]) },
      uC: { value: new THREE.Color(palette[2]) },
      uBg: { value: new THREE.Color(palette[3]) },
      uIntensity: { value: intensity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const onMove = (e) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const u = ref.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uAspect.value = size.width / Math.max(1, size.height);
    mouse.current.lerp(target.current, Math.min(1, delta * 2.2));
    u.uMouse.value.copy(mouse.current);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={ref} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} />
    </mesh>
  );
}

export default function AuroraCanvas({ palette, intensity }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Plane palette={palette} intensity={intensity} />
    </Canvas>
  );
}
