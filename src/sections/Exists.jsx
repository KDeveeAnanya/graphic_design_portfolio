import { useRef } from "react";
import { useCursorReveal } from "../hooks/useCursorReveal";

function Exists() {
  const wordRef = useRef(null);
  useCursorReveal(wordRef);

  return (
    <section className="exists" aria-label="Statement">
      <h2 className="exists-line">
        <span className="exists-pre">A brand only</span>
        <span className="exists-word" ref={wordRef} data-text="EXISTS">
          EXISTS
        </span>
        <span className="exists-post">when someone can hold it.</span>
      </h2>
    </section>
  );
}

export default Exists;
