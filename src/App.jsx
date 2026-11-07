import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import Hero from "./sections/Hero";
import Intro from "./sections/Intro";
import Work from "./sections/Work";
import Exists from "./sections/Exists";
import Lab from "./sections/Lab";
import About from "./sections/About";
import Contact from "./sections/Contact";
import { projects } from "./data/projects";
import { site } from "./data/site";
import { copyText, goTo } from "./lib/palette";

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const close = useCallback(() => setPaletteOpen(false), []);
  const open = useCallback(() => setPaletteOpen(true), []);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands = useMemo(
    () => [
      { id: "work", label: "Go to Work", hint: "section", run: () => goTo("work") },
      ...projects.map((p) => ({
        id: p.id,
        label: `Open ${p.name}`,
        hint: "project",
        run: () => goTo(p.id),
      })),
      { id: "more", label: "Open more work", hint: "project", run: () => goTo("more") },
      { id: "lab", label: "Go to The Lab", hint: "section", run: () => goTo("lab") },
      { id: "about", label: "Go to About", hint: "section", run: () => goTo("about") },
      { id: "contact", label: "Go to Contact", hint: "section", run: () => goTo("contact") },
      { id: "copy", label: "Copy email address", hint: "action", run: () => copyText(site.email) },
      {
        id: "create",
        label: "sudo create",
        hint: "start a project",
        run: () => {
          window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("New project")}`;
        },
      },
    ],
    []
  );

  return (
    <>
      <Navbar onOpenPalette={open} />
      <main id="top">
        <Hero />
        <Intro />
        <Work />
        <Exists />
        <Lab />
        <About />
        <Contact />
      </main>
      <CommandPalette open={paletteOpen} onClose={close} commands={commands} />
    </>
  );
}

export default App;
