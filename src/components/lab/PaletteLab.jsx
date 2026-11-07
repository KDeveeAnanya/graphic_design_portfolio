import { useEffect, useRef, useState } from "react";
import { projects } from "../../data/projects";
import { contrast, copyText, extractPalette, grade } from "../../lib/palette";

const samples = projects.map((p) => ({ id: p.id, label: p.name, src: p.image }));

function PaletteLab() {
  const [src, setSrc] = useState(samples[0].src);
  const [swatches, setSwatches] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const objectUrl = useRef("");

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      const size = 96;
      canvas.width = size;
      canvas.height = Math.round((img.height / img.width) * size);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setSwatches(extractPalette(data, 6));
      setError("");
    };
    img.onerror = () => !cancelled && setError("That file could not be read as an image.");
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setSrc(objectUrl.current);
  };

  const copy = async (hex) => {
    if (await copyText(hex)) {
      setCopied(hex);
      setTimeout(() => setCopied(""), 1400);
    }
  };

  return (
    <div className="palette-lab">
      <div className="palette-lab-source">
        <div className="palette-lab-samples" role="group" aria-label="Sample images">
          {samples.map((s) => (
            <button
              key={s.id}
              type="button"
              className={src === s.src ? "is-active" : ""}
              onClick={() => setSrc(s.src)}
              aria-label={`Use ${s.label}`}
            >
              <img src={s.src} alt="" width="56" height="70" />
            </button>
          ))}
        </div>
        <label className="lab-button">
          Use your own image
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
      </div>

      {error && <p className="lab-error" role="alert">{error}</p>}

      <ul className="palette-lab-swatches">
        {swatches.map((s) => {
          const onWhite = contrast(s.hex, "#FFFFFF");
          const onBlack = contrast(s.hex, "#000000");
          const useWhite = onWhite >= onBlack;
          const ratio = Math.max(onWhite, onBlack);
          return (
            <li key={s.hex}>
              <button
                type="button"
                style={{ background: s.hex, color: useWhite ? "#fff" : "#000" }}
                onClick={() => copy(s.hex)}
                title={`Copy ${s.hex}`}
              >
                <span className="swatch-hex">{copied === s.hex ? "copied" : s.hex}</span>
                <span className="swatch-meta">
                  {useWhite ? "white" : "black"} text {ratio.toFixed(1)}:1 {grade(ratio)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PaletteLab;
