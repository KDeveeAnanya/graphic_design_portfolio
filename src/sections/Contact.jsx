import { useState } from "react";
import { site } from "../data/site";
import { copyText } from "../lib/palette";

function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (await copyText(site.email)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-main">
        <h2 id="contact-title">
          Have a project
          <br />
          in mind?
        </h2>

        <a className="contact-email" href={`mailto:${site.email}`}>
          {site.email}
          <span aria-hidden="true"> ↗</span>
        </a>

        <div className="contact-actions">
          <a
            className="cmd-button"
            href={`mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}`}
          >
            <span aria-hidden="true">$ </span>discuss a project
          </a>
          <button type="button" className="cmd-button cmd-button--quiet" onClick={copy}>
            {copied ? "email copied" : "copy email"}
          </button>
        </div>

        {site.socials.length > 0 && (
          <ul className="contact-socials">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="footer">
        <span>© {site.year} {site.name}</span>
        <span>Brand identity · Packaging · Social media</span>
        <span className="footer-exit">exit 0</span>
      </footer>
    </section>
  );
}

export default Contact;
