import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* A sleek designer-bot bust: ceramic white body, black visor with glowing
   orange eyes, headphones. The head follows the cursor and it blinks. */
function Character() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.1, 8);
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0xff720d, 3.4);
    rim.position.set(-5, 2, -3);
    scene.add(key, rim);

    const m = (color, o = {}) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.18, envMapIntensity: 0.9, ...o });
    const white = m(0xf2f2f2);
    const graphite = m(0x1b1b20, { metalness: 0.55, roughness: 0.3 });
    const visorMat = m(0x040406, { roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.4 });
    const orange = m(0xff720d, { roughness: 0.28, clearcoat: 1 });
    const glow = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff720d, emissiveIntensity: 3 });

    const box = (w, h, d, r, mat) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, r), mat);
    const rig = new THREE.Group();
    scene.add(rig);

    const torso = box(2.7, 1.55, 1.25, 0.5, white);
    torso.position.y = -1.2;
    const stripe = box(1.0, 0.14, 0.1, 0.05, orange);
    stripe.position.set(0, -0.85, 0.62);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.45, 32), graphite);
    neck.position.y = -0.3;
    rig.add(torso, stripe, neck);

    const head = new THREE.Group();
    head.position.y = 0.62;
    const skull = box(1.8, 1.55, 1.5, 0.52, white);
    const visor = box(1.45, 0.68, 0.3, 0.3, visorMat);
    visor.position.set(0, 0.05, 0.62);
    const eyes = [-1, 1].map((s) => {
      const e = box(0.3, 0.16, 0.08, 0.07, glow);
      e.position.set(s * 0.36, 0.05, 0.8);
      return e;
    });
    const cups = [-1, 1].map((s) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.28, 48), orange);
      c.rotation.z = Math.PI / 2;
      c.position.set(s * 0.98, 0, 0);
      return c;
    });
    const band = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.065, 20, 72, Math.PI), graphite);
    band.scale.y = 0.82;
    band.position.y = 0.02;
    head.add(skull, visor, ...eyes, ...cups, band);
    rig.add(head);
    rig.position.y = -0.1;

    let nx = 0;
    let ny = 0;
    let hover = false;
    let scale = 1;
    let frame = 0;
    let visible = true;
    const t0 = performance.now();

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      nx = THREE.MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
      ny = THREE.MathUtils.clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
    };
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);

    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      if (!reduce) {
        rig.position.y = -0.1 + Math.sin(t * 1.4) * 0.06;
        head.rotation.y += (nx * 0.7 - head.rotation.y) * 0.1;
        head.rotation.x += (ny * 0.35 - head.rotation.x) * 0.1;
        rig.rotation.y += (nx * 0.25 - rig.rotation.y) * 0.06;
        scale += ((hover ? 1.05 : 1) - scale) * 0.1;
        rig.scale.setScalar(scale);
        const blink = t % 4.2 < 0.14 ? 0.1 : 1;
        eyes.forEach((e) => (e.scale.y = blink));
      }
      renderer.render(scene, camera);
      if (!reduce && visible) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    io.observe(el);

    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => o.geometry?.dispose());
      [white, graphite, visorMat, orange, glow].forEach((x) => x.dispose());
      scene.environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-char" ref={mount} role="img" aria-label="A 3D robot designer character whose head follows your cursor" />;
}

export default Character;
