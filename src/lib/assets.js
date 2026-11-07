/*
 * Finds your work images in src/assets/work by keyword in the file name, so a
 * renamed or re-exported file (e.g. "jksh-transparent.png") is picked up
 * without touching any code. If several files match a brand, one with
 * "transparent", "clear", "nobg" or "cutout" in its name wins.
 */
const urls = import.meta.glob("../assets/work/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const files = Object.entries(urls).map(([path, url]) => ({
  name: path.split("/").pop(),
  url,
}));

const PREFER = /transparent|clear|nobg|no-bg|cutout|cut-out/i;

export function pick(include, exclude) {
  const matches = files.filter(
    (f) => include.test(f.name) && !(exclude && exclude.test(f.name))
  );
  if (!matches.length) return undefined;
  return (matches.find((f) => PREFER.test(f.name)) || matches[0]).url;
}

if (import.meta.env.DEV) {
  console.info("[assets] files found in src/assets/work:", files.map((f) => f.name));
}
