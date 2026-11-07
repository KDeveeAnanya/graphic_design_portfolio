import { useCallback, useEffect, useRef, useState } from "react";
import Character from "../components/Character";

const WORDS = ["LOGOS.", "PACKAGING.", "POSTS.", "BRANDS."];
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#/";
const LAYERS = ["headline", "character", "glow", "grid"];

function Hero() {
  const heroRef = useRef(null);
  const readoutRef = useRef(null);
  const wordIndex = useRef(0);
  const scramble = useRef(0);

  const [word, setWord] = useState(WORDS[0]);
  const [current, setCurrent] = useState(WORDS[0]);
  const [layers, setLayers] = useState({ headline: true, character: true, glow: true, grid: true });
  const [marks, setMarks] = useState([]);
  const [awake, setAwake] = useState(false);
  const [size, setSize] = useState({ w: 1440, h: 900 });

  /* Change what I make: the word decodes into the next one. */
  const makeNext = useCallback(() => {
    wordIndex.current = (wordIndex.current + 1) % WORDS.length;
    const target = WORDS[wordIndex.current];
    setCurrent(target);
    cancelAnimationFrame(scramble.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWord(target);
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 650);
      const out = target
        .split("")
        .map((ch, i) =>
          ch === "." || p > (i + 1) / (target.length + 1)
            ? ch
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        )
        .join("");
      setWord(p < 1 ? out : target);
      if (p < 1) scramble.current = requestAnimationFrame(step);
    };
    scramble.current = requestAnimationFrame(step);
  }, []);

  const toggle = (id) => setLayers((l) => ({ ...l, [id]: !l[id] }));

  /* Click to drop a registration marker (precise pointers only). */
  const drop = (e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (e.target.closest("a, button, .hero-layers")) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setMarks((m) => [...m.slice(-11), { id: performance.now(), x, y }]);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "c" && !e.metaKey && !e.ctrlKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
        setMarks([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(scramble.current);
    };
  }, []);

  /* Ruler length follows the hero size. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  /* Cursor: guides + readout (always, on precise pointers), parallax (unless reduced motion). */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = hero.querySelectorAll(".hero-title-line");

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    let running = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      hero.style.setProperty("--px", currentX.toFixed(4));
      hero.style.setProperty("--py", currentY.toFixed(4));

      if (Math.abs(targetX - currentX) < 0.0005 && Math.abs(targetY - currentY) < 0.0005) {
        running = false;
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const handleMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      hero.style.setProperty("--gx", `${x}px`);
      hero.style.setProperty("--gy", `${y}px`);
      if (readoutRef.current) {
        readoutRef.current.textContent = `x ${String(Math.round(x)).padStart(4, "0")}  y ${String(Math.round(y)).padStart(4, "0")}`;
      }

      lines.forEach((line) => {
        const r = line.getBoundingClientRect();
        line.style.setProperty("--lx", `${event.clientX - r.left}px`);
        line.style.setProperty("--ly", `${event.clientY - r.top}px`);
      });

      if (!reduceMotion) {
        targetX = x / rect.width - 0.5;
        targetY = y / rect.height - 0.5;
        start();
      }
    };
    const handleEnter = () => hero.style.setProperty("--reveal", "1");
    const handleLeave = () => {
      hero.style.setProperty("--reveal", "0");
      targetX = 0;
      targetY = 0;
      if (!reduceMotion) start();
    };

    hero.addEventListener("pointermove", handleMove);
    hero.addEventListener("pointerenter", handleEnter);
    hero.addEventListener("pointerleave", handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerenter", handleEnter);
      hero.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  const hidden = LAYERS.filter((l) => !layers[l]).map((l) => `hero--no-${l}`).join(" ");
  const spoken = `I make ${current.slice(0, -1).toLowerCase()}.`;

  return (
    <section
      className={`hero ${hidden} ${awake ? "is-awake" : ""}`}
      ref={heroRef}
      aria-label="Introduction"
      onPointerDown={drop}
    >
      {/* Artboard furniture: grid lens, rulers, guides, crop marks */}
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-extras">
      <div className="ruler ruler--x" aria-hidden="true">
        {Array.from({ length: Math.ceil(size.w / 100) + 1 }, (_, i) => (
          <span key={i} style={{ left: i * 100 + 3 }}>{i * 100}</span>
        ))}
        <i className="ruler-mark ruler-mark--x" />
      </div>
      <div className="ruler ruler--y" aria-hidden="true">
        {Array.from({ length: Math.ceil(size.h / 100) + 1 }, (_, i) => (
          <span key={i} style={{ top: i * 100 + 3 }}>{i * 100}</span>
        ))}
        <i className="ruler-mark ruler-mark--y" />
      </div>
      <i className="ruler-corner" aria-hidden="true" />

      <i className="hero-guide hero-guide--v" aria-hidden="true" />
      <i className="hero-guide hero-guide--h" aria-hidden="true" />
      <span className="hero-readout" ref={readoutRef} aria-hidden="true">x 0000  y 0000</span>

      <i className="crop crop--tl" aria-hidden="true" />
      <i className="crop crop--tr" aria-hidden="true" />
      <i className="crop crop--bl" aria-hidden="true" />
      <i className="crop crop--br" aria-hidden="true" />

      {marks.map((m) => (
        <span key={m.id} className="hero-mark" style={{ left: m.x, top: m.y }} aria-hidden="true">
          <b>{m.x}, {m.y}</b>
        </span>
      ))}
      </div>

      {/* The one thing to look at. Hover it and the rest of the hero wakes up. */}
      <div className="hero-stage">
        <div
          className="hero-object"
          tabIndex={0}
          onPointerEnter={() => setAwake(true)}
          onFocus={() => setAwake(true)}
          onClick={() => setAwake(true)}
        >
          <div className="hero-object-glow" />
          <Character />
          <span className="hero-hint" aria-hidden="true" />
        </div>
      </div>

      {/* Headline sits in front of the product window */}
      <h1 className="hero-title" aria-label={spoken}>
        <span className="hero-title-line" data-text="I MAKE" aria-hidden="true">
          I MAKE
        </span>
        <span
          className="hero-title-line hero-title-outline"
          data-text={word}
          aria-hidden="true"
        >
          {word}
        </span>
      </h1>
      <button type="button" className="hero-word-btn" onClick={makeNext}>
        <span aria-hidden="true">↻</span> click to see what I create
      </button>
      <span className="sr-only" aria-live="polite">{spoken}</span>

      <div className="hero-extras">
      <div className="hero-intro">
        <span className="hero-prompt">
          <span className="hero-prompt-dot" aria-hidden="true" />
          ~/creative-space
        </span>
        <span>LOGO DESIGN · PACKAGING · SOCIAL MEDIA</span>
      </div>

      <div className="hero-layers" role="group" aria-label="Hero layers">
        <p className="hero-layers-title">layers · click to toggle</p>
        {LAYERS.map((id) => (
          <button
            key={id}
            type="button"
            className={layers[id] ? "" : "is-off"}
            aria-pressed={layers[id]}
            onClick={() => toggle(id)}
          >
            <span aria-hidden="true">{layers[id] ? "◉" : "○"}</span>
            {id}
          </button>
        ))}
        <button type="button" className="hero-make" onClick={makeNext}>
          <span aria-hidden="true">↻</span> click to see what I create
        </button>
      </div>

      <div className="hero-statement">
        <p>
          I design logos, brand identities, packaging and social media graphics
          for businesses and emerging brands.
        </p>
        <a href="#work" className="hero-cta">
          <span className="hero-cta-cmd">view selected work</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="hero-bottom">
        <span className="hero-name">
          K. DEVEE ANANYA
          <i className="wedge" aria-hidden="true" />
        </span>
        <span>SCROLL TO ENTER ↓</span>
        <span>2026</span>
      </div>
      </div>
    </section>
  );
}

export default Hero;
