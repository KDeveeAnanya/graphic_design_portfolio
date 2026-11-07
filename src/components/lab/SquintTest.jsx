import { useState } from "react";
import { projects } from "../../data/projects";

function SquintTest() {
  const [id, setId] = useState(projects[0].id);
  const [blur, setBlur] = useState(7);
  const [grey, setGrey] = useState(true);
  const project = projects.find((p) => p.id === id);

  return (
    <div className="squint">
      <div className="squint-controls">
        <div role="group" aria-label="Choose a project" className="squint-tabs">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={p.id === id ? "is-active" : ""}
              aria-pressed={p.id === id}
              onClick={() => setId(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>

        <label className="squint-range">
          <span>blur: {blur}px</span>
          <input
            type="range"
            min="0"
            max="7"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
          />
        </label>

        <label className="squint-check">
          <input type="checkbox" checked={grey} onChange={(e) => setGrey(e.target.checked)} />
          <span>greyscale</span>
        </label>

        <p className="squint-note">
          If the hierarchy is working, the brand name and the product are still
          the first things you see.
        </p>
      </div>

      <div className="squint-frame" style={{ aspectRatio: `${project.width} / ${project.height}` }}>
        <img
          src={project.image}
          alt={`${project.name} artwork, blurred for the squint test`}
          style={{ filter: `blur(${blur}px) ${grey ? "grayscale(1)" : ""}` }}
        />
      </div>
    </div>
  );
}

export default SquintTest;
