import { useEffect, useRef, useState } from "react";
import CaseStudy from "../components/CaseStudy";
import { projects, group, more } from "../data/projects";
import { goTo } from "../lib/palette";

function Lightbox({ item, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.full}
      onClick={onClose}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose}>
        close <span aria-hidden="true">esc</span>
      </button>
      <img
        src={item.image}
        alt={item.alt}
        className={`lightbox-img lightbox-img--${item.kind}`}
        onClick={(e) => e.stopPropagation()}
      />
      <p className="lightbox-caption">
        {item.full} <span>{item.tag}</span>
      </p>
    </div>
  );
}

function Work() {
  const [open, setOpen] = useState(null);

  return (
    <section id="work" aria-label="Selected work">
      {projects.map((p) => (
        <CaseStudy key={p.id} project={p} />
      ))}

      <div className="more" id="more">
        <header className="more-head">
          <h3>Additional work</h3>

          <div className="group" aria-label="Company group">
            <p className="group-parent">{group.parent}</p>
            <ul>
              {group.children.map((c) => (
                <li key={c.name}>
                  <button type="button" onClick={() => goTo(c.target)}>
                    <span className="group-name">{c.name}</span>
                    <span className="group-note">{c.note}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <ul className="bento">
          {more.map((item) => (
            <li key={item.id} className={`tile-cell tile-cell--${item.id}`}>
              <button
                type="button"
                className={`tile tile--${item.kind}`}
                onClick={() => item.image && setOpen(item)}
                aria-label={`${item.full}, ${item.tag}. Open larger view`}
                disabled={!item.image}
              >
                <span className="tile-face">
                  <span className="tile-tag">{item.tag}</span>
                  <span className="tile-name">{item.name}</span>
                </span>

                {item.image && (
                  <span className="tile-art" aria-hidden="true">
                    <img src={item.image} alt="" loading="lazy" />
                    <span className="tile-caption">
                      {item.full}
                      <em>{item.tag}</em>
                    </span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

export default Work;
