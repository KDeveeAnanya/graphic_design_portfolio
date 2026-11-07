import { useActiveSection } from "../hooks/useInView";

const links = [
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
const ids = links.map((l) => l.id);

function Navbar({ onOpenPalette }) {
  const active = useActiveSection(ids);
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <nav className="navbar" aria-label="Main">
      <a href="#top" className="logo" aria-label="K. Devee Ananya, back to top">
        KDA
      </a>

      <div className="nav-links">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            aria-current={active === l.id ? "true" : undefined}
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          className="nav-cmd"
          onClick={onOpenPalette}
          aria-label="Open command menu"
        >
          <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd>K</kbd>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
