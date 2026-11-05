import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Pointer position, -0.5 .. 0.5, shared with the render loop
const pointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  });
}

// Page height is read once and on resize, never per frame (a layout read every frame causes jank)
const metrics = { max: 1 };
if (typeof window !== 'undefined') {
  const measure = () => {
    metrics.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };
  window.addEventListener('load', measure);
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(document.documentElement);
  measure();
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// [radius, tube, rotX, rotY, rotZ]
const LOOPS = [
  [4.4, 0.62, 0.3, 0.2, 0],
  [4.0, 0.5, 1.2, -0.5, 0.6],
  [3.5, 0.42, -0.6, 0.9, 1.2],
  [5.0, 0.35, 0.9, 0.4, 2.0],
];

// Studio-style reflections, generated in code (no HDR file to download)
function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.03);
    scene.environment = target.texture;
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Loops() {
  const group = useRef();
  const meshes = useRef([]);
  const glint = useRef();
  const state = useRef({ cx: 0, cy: 0, lastY: 0, vel: 0 });
  const reduce = useMemo(reduceMotion, []);
  const { setDpr, setFrameloop } = useThree();
  // Adaptive quality: if the device can't keep up, drop resolution first, then pause the 3D
  const perf = useRef({ warm: 0, t: 0, n: 0, level: 0 });

  useFrame(({ gl, size }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const pf = perf.current;
    if (pf.warm < 90) pf.warm++; // ignore shader compile / preloader frames
    else {
      pf.t += rawDt;
      pf.n++;
      if (pf.t > 2) {
        const fps = pf.n / pf.t;
        pf.t = 0;
        pf.n = 0;
        if (fps < 40 && pf.level === 0) {
          pf.level = 1;
          setDpr(1);
        } else if (fps < 24 && pf.level === 1) {
          pf.level = 2;
          setFrameloop('never');
        }
      }
    }
    const s = state.current;
    const mobile = size.width < 900;
    const scrollY = window.scrollY;
    const maxS = metrics.max;
    const p = scrollY / maxS;
    const hero = Math.max(0, 1 - scrollY / (window.innerHeight * 0.9));

    s.cx += (pointer.x - s.cx) * Math.min(1, dt * 2.5);
    s.cy += (pointer.y - s.cy) * Math.min(1, dt * 2.5);
    s.vel += (Math.min(Math.abs(scrollY - s.lastY), 80) * 0.004 - s.vel) * 0.1;
    s.lastY = scrollY;

    const g = group.current;
    const tx = mobile ? 0.5 : 2.6 - p * 5.2 * Math.sin(p * 3.1);
    g.position.x += (tx - g.position.x) * Math.min(1, dt * 3);
    g.position.y = mobile ? 2.2 - p * 3 : 0.1 - p * 1.2;
    g.scale.setScalar(mobile ? 0.6 : 1 + 0.25 * Math.sin(p * 6));
    g.rotation.y = s.cx * 0.5 + p * 2.4;
    g.rotation.x = s.cy * 0.35 + p * 0.9;

    if (!reduce) {
      meshes.current.forEach((m, i) => {
        m.rotation.z += (dt * 0.05 + s.vel * dt * 6) * (i % 2 ? -1 : 1);
        m.rotation.y += dt * 0.03;
      });
    }
    glint.current.position.set(s.cx * 14, -s.cy * 9, 4.5);
    gl.domElement.style.opacity = (0.45 + 0.55 * hero).toFixed(3);
  });

  return (
    <>
      <group ref={group}>
        {LOOPS.map(([R, r, rx, ry, rz], i) => (
          <mesh key={i} ref={(m) => (meshes.current[i] = m)} rotation={[rx, ry, rz]}>
            <torusGeometry args={[R, r, 40, 160]} />
            <meshPhysicalMaterial
              color={0x0b0b0c}
              metalness={0.85}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.12}
              envMapIntensity={1.35}
            />
          </mesh>
        ))}
      </group>
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-6, -2, -3]} intensity={1.4} color={0xbfc8ff} />
      <pointLight ref={glint} position={[0, 0, 5]} intensity={70} distance={22} />
    </>
  );
}

export default function Scene() {
  return (
    <div className="gl" aria-hidden="true">
      <Canvas
        dpr={[1, 1.25]}
        camera={{ fov: 40, position: [0, 0, 10], near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ pointerEvents: 'none' }}
      >
        <Environment />
        <Loops />
      </Canvas>
    </div>
  );
}
