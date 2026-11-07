import { useEffect, useRef, useState } from "react";

function CommandPalette({ open, onClose, commands }) {
  // Mounted only while open, so its state starts fresh every time.
  return open ? <Dialog onClose={onClose} commands={commands} /> : null;
}

function Dialog({ onClose, commands }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    inputRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  const list = commands.filter((c) =>
    c.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const run = (cmd) => {
    onClose();
    // wait for the dialog to unmount so focus and scrolling don't fight
    setTimeout(() => cmd.run(), 30);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && list[index]) {
      e.preventDefault();
      run(list[index]);
    }
  };

  return (
    <div className="palette-overlay" onMouseDown={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="palette-input">
          <span aria-hidden="true">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Go to a project, section or action"
            aria-label="Search commands"
            spellCheck="false"
          />
        </div>

        <ul className="palette-list">
          {list.length === 0 && <li className="palette-empty">No match. Try “work” or “contact”.</li>}
          {list.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                className={i === index ? "is-active" : ""}
                onMouseEnter={() => setIndex(i)}
                onClick={() => run(c)}
              >
                <span>{c.label}</span>
                <span className="palette-hint">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CommandPalette;
