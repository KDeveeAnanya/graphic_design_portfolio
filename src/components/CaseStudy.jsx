import { useRef, useState } from "react";
import { useInView } from "../hooks/useInView";
import { copyText } from "../lib/palette";

function CaseStudy({ project }) {
  const { id, name, kind, image, alt, width, height, statement, palette, hotspots } = project;
  const [active, setActive] = useState(0);
  const [inspect, setInspect] = useState(true);
  const [copied, setCopied] = useState("");
  const figureRef = useRef(null);
  const seen = useInView(figureRef, 0.2);

  const copy = async (hex) => {
    if (await copyText(hex)) {
      setCopied(hex);
      setTimeout(() => setCopied(""), 1400);
    }
  };

  return (
    <article className={`case case--${id}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="case-bg" aria-hidden="true" />

      <header className="case-title">
        <h3 id={`${id}-title`}>{name}</h3>
        <p className="case-kind">{kind}</p>
      </header>

      <figure
        className={`case-figure ${seen ? "is-in" : ""}`}
        ref={figureRef}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <div className="case-img">
          <img src={image} alt={alt} width={width} height={height} loading="lazy" />
        </div>

        {inspect &&
          hotspots.map((h, i) => (
            <button
              key={h.title}
              type="button"
              className={`marker ${i === active ? "is-active" : ""}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label={`${i + 1}. ${h.title}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              {i + 1}
            </button>
          ))}
      </figure>

      <p className="case-statement">{statement}</p>

      <div className="case-notes">
        <div className="case-notes-head">
          <span>Design notes</span>
          <button
            type="button"
            className="case-toggle"
            aria-pressed={inspect}
            onClick={() => setInspect((v) => !v)}
          >
            inspect: {inspect ? "on" : "off"}
          </button>
        </div>

        <ol>
          {hotspots.map((h, i) => (
            <li key={h.title} className={i === active ? "is-active" : ""}>
              <button
                type="button"
                aria-expanded={i === active}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="note-n">{i + 1}</span>
                <span className="note-title">{h.title}</span>
              </button>
              <div className="note-body">
                <p>{h.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ul className="case-palette" aria-label={`${name} colour palette`}>
        {palette.map((c) => (
          <li key={c.hex}>
            <button type="button" onClick={() => copy(c.hex)} title={`Copy ${c.hex}`}>
              <span className="swatch" style={{ background: c.hex }} />
              <span className="swatch-hex">{copied === c.hex ? "copied" : c.hex}</span>
              <span className="swatch-name">{c.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default CaseStudy;
