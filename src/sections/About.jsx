function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <h2 id="about-title" className="about-main">
        I’m K. Devee Ananya, an independent graphic designer working across
        brand identity, packaging and social media design.
      </h2>

      <div className="about-side">
        <p>
          I bring a considered, detail-focused approach to each brief, balancing
          visual expression with clarity and purpose. My background in Computer
          Science also informs the structured way I approach creative problems.
        </p>

        <pre className="about-json" aria-label="Profile summary">
{`{
  `}<span className="k">"name"</span>{`: `}<span className="s">"K. Devee Ananya"</span>{`,
  `}<span className="k">"education"</span>{`: `}<span className="s">"B.Tech, Computer Science"</span>{`,
  `}<span className="k">"practice"</span>{`: `}<span className="s">"Independent designer"</span>{`,
  `}<span className="k">"since"</span>{`: `}<span className="n">2024</span>{`,
  `}<span className="k">"principles"</span>{`: [`}<span className="s">"clarity"</span>{`, `}<span className="s">"consistency"</span>{`, `}<span className="s">"purpose"</span>{`]
}`}
        </pre>
      </div>
    </section>
  );
}

export default About;
