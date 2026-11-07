const toHex = (rgb) =>
  "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

const dist = (a, b) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const channel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
};

export function contrast(hexA, hexB) {
  const a = luminance(hexA);
  const b = luminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function grade(ratio) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "fails";
}

/** Bucket pixels into 16 levels per channel, then keep the most common, well-separated colours. */
export function extractPalette(data, count = 6) {
  const buckets = new Map();
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    total++;
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const e = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
    e.n++;
    e.r += data[i];
    e.g += data[i + 1];
    e.b += data[i + 2];
    buckets.set(key, e);
  }
  const all = [...buckets.values()]
    .map((e) => ({ n: e.n, rgb: [e.r / e.n, e.g / e.n, e.b / e.n].map(Math.round) }))
    .sort((a, b) => b.n - a.n);

  const picked = [];
  for (const c of all) {
    if (picked.every((p) => dist(p.rgb, c.rgb) > 52)) picked.push(c);
    if (picked.length === count) break;
  }
  return picked.map((p) => ({ hex: toHex(p.rgb), share: p.n / total }));
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
