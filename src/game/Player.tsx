"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { ROOM, PILLARS } from "./Facility";
import { sections, type SectionId } from "@/data/portfolio";
import { game } from "./store";
import { targetHits } from "./Targets";
import { playShot, playHit } from "./audio";

const SPEED = 7.5;
const ACCEL = 14;
const EYE = 1.7;
const RADIUS = 0.45;

type Impact = { mesh: THREE.Mesh; born: number };

export function Player() {
  const { camera, scene, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const vel = useRef(new THREE.Vector3());
  const gun = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Mesh>(null);
  const flashLight = useRef<THREE.PointLight>(null);
  const recoil = useRef(0);
  const lastShot = useRef(-1);
  const bob = useRef(0);
  const impacts = useRef<Impact[]>([]);
  const ray = useRef(new THREE.Raycaster());

  useEffect(() => {
    const g = gun.current;
    if (!g) return;
    camera.add(g);
    scene.add(camera);
    return () => {
      camera.remove(g);
    };
  }, [camera, scene]);

  useEffect(() => {
    camera.position.set(0, EYE, 12);
    camera.lookAt(0, EYE + 0.6, 0);
    const d = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const u = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    return () => {
      window.removeEventListener("keydown", d);
      window.removeEventListener("keyup", u);
    };
  }, [camera]);

  useEffect(() => {
    const shoot = (e: MouseEvent) => {
      if (e.button !== 0 || !game.get().locked) return;
      const now = performance.now() / 1000;
      if (now - lastShot.current < 0.12) return;
      lastShot.current = now;
      recoil.current = 1;
      playShot();
      game.set({ shots: game.get().shots + 1 });
      ray.current.setFromCamera(new THREE.Vector2(0, 0), camera);
      const hits = ray.current.intersectObjects(scene.children, true).filter((h) => !h.object.userData['noHit']);
      const hit = hits[0];
      if (!hit) return;
      // impact spark
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshBasicMaterial({ color: "#ffd8a8", transparent: true, toneMapped: false }),
      );
      m.userData['noHit'] = true;
      m.position.copy(hit.point);
      scene.add(m);
      impacts.current.push({ mesh: m, born: now });
      let o: THREE.Object3D | null = hit.object;
      let id: SectionId | undefined;
      while (o && !id) {
        id = o.userData['section'] as SectionId | undefined;
        o = o.parent;
      }
      if (id && sections[id]) {
        playHit();
        (m.material as THREE.MeshBasicMaterial).color.set(sections[id].color);
        targetHits[id] = performance.now() / 1000;
        game.set({ hitTick: game.get().hitTick + 1 });
        setTimeout(() => {
          document.exitPointerLock();
          game.set({ open: id });
        }, 420);
      }
    };
    gl.domElement.ownerDocument.addEventListener("mousedown", shoot);
    return () => gl.domElement.ownerDocument.removeEventListener("mousedown", shoot);
  }, [camera, scene, gl]);

  useFrame(({ clock }, raw) => {
    const dt = Math.min(raw, 0.05);
    const k = keys.current;
    const active = game.get().locked;
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
    const wish = new THREE.Vector3();
    if (active) {
      if (k['KeyW']) wish.add(fwd);
      if (k['KeyS']) wish.sub(fwd);
      if (k['KeyD']) wish.add(right);
      if (k['KeyA']) wish.sub(right);
    }
    if (wish.lengthSq() > 0) wish.normalize().multiplyScalar(k['ShiftLeft'] ? SPEED * 0.5 : SPEED);
    vel.current.lerp(wish, 1 - Math.exp(-ACCEL * dt));
    const p = camera.position;
    p.addScaledVector(vel.current, dt);
    // collisions
    const hx = ROOM.w / 2 - RADIUS, hz = ROOM.d / 2 - RADIUS;
    p.x = THREE.MathUtils.clamp(p.x, -hx, hx);
    p.z = THREE.MathUtils.clamp(p.z, -hz, hz);
    const pushBox = (cx: number, cz: number, h: number) => {
      const dx = p.x - cx, dz = p.z - cz;
      const ex = h + RADIUS, ez = h + RADIUS;
      if (Math.abs(dx) < ex && Math.abs(dz) < ez) {
        if (ex - Math.abs(dx) < ez - Math.abs(dz)) p.x = cx + Math.sign(dx || 1) * ex;
        else p.z = cz + Math.sign(dz || 1) * ez;
      }
    };
    PILLARS.forEach(([x, z]) => pushBox(x, z, 0.7));
    Object.values(sections).forEach((s) => pushBox(s.position[0], s.position[2], 1));

    const speed = vel.current.length();
    bob.current += dt * speed * 1.6;
    p.y = EYE + Math.sin(bob.current * 2) * 0.03 * Math.min(speed / SPEED, 1);

    // weapon follows camera
    recoil.current = Math.max(0, recoil.current - dt * 9);
    if (gun.current) {
      const r = recoil.current;
      const m = speed / SPEED;
      gun.current.position.set(0.2 + Math.cos(bob.current) * 0.01 * m, -0.17 + Math.abs(Math.sin(bob.current)) * 0.012 * m, -0.42 + r * 0.06);
      gun.current.rotation.set(r * 0.12, 0, 0);
    }
    const f = recoil.current > 0.7 ? 1 : 0;
    if (flash.current) {
      flash.current.visible = f > 0;
      flash.current.rotation.z = Math.random() * Math.PI;
    }
    if (flashLight.current) flashLight.current.intensity = f * 8;

    // impacts fade
    const now = clock.elapsedTime >= 0 ? performance.now() / 1000 : 0;
    impacts.current = impacts.current.filter((i) => {
      const a = now - i.born;
      const mat = i.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - a / 0.6);
      i.mesh.scale.setScalar(1 + a * 3);
      if (a > 0.6) {
        scene.remove(i.mesh);
        i.mesh.geometry.dispose();
        mat.dispose();
        return false;
      }
      return true;
    });
  });

  return (
    <>
      <PointerLockControls
        selector="#__no-auto-lock"
        onLock={() => game.set({ locked: true, open: null })}
        onUnlock={() => game.set({ locked: false })}
      />
      <group ref={gun} scale={0.5}>
        <mesh userData={{ noHit: true }} position={[0, 0, 0]}>
          <boxGeometry args={[0.09, 0.13, 0.5]} />
          <meshStandardMaterial color="#4a505c" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh userData={{ noHit: true }} position={[0, 0.03, -0.32]}>
          <boxGeometry args={[0.05, 0.05, 0.25]} />
          <meshStandardMaterial color="#2a2e36" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh userData={{ noHit: true }} position={[0, -0.12, 0.1]} rotation-x={0.25}>
          <boxGeometry args={[0.07, 0.16, 0.08]} />
          <meshStandardMaterial color="#14171d" />
        </mesh>
        <mesh userData={{ noHit: true }} position={[0.047, 0.01, -0.05]}>
          <boxGeometry args={[0.005, 0.02, 0.36]} />
          <meshBasicMaterial color="#ff4655" toneMapped={false} />
        </mesh>
        <mesh ref={flash} userData={{ noHit: true }} position={[0, 0.03, -0.48]} visible={false}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.9} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <pointLight ref={flashLight} position={[0, 0.03, -0.55]} color="#ffb860" intensity={0} distance={5} />
      </group>
    </>
  );
}
