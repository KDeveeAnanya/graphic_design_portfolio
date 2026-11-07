import { experiments } from "../data/lab";

function Lab() {
  return (
    <section className="lab" id="lab" aria-labelledby="lab-title">
      <header className="lab-head">
        <h2 id="lab-title">The Lab</h2>
        <p>Small tools I built to test my own work. Each one runs in your browser.</p>
      </header>

      {experiments.map(({ id, path, title, note, Component }) => (
        <div className="exp" key={id}>
          <div className="exp-meta">
            <span className="exp-path">~/{path}</span>
            <h3>{title}</h3>
            <p>{note}</p>
          </div>
          <div className="exp-body">
            <Component />
          </div>
        </div>
      ))}
    </section>
  );
}

export default Lab;
