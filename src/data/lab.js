import PaletteLab from "../components/lab/PaletteLab";
import SquintTest from "../components/lab/SquintTest";

/* Interactive design checks and visual experiments. */
export const experiments = [
  {
    id: "palette",
    path: "lab/palette",
    title: "Palette extractor",
    note: "Analyse an image to identify its dominant colours and check text contrast across the palette. Use a portfolio project or upload your own image.",
    Component: PaletteLab,
  },
  {
    id: "squint",
    path: "lab/squint",
    title: "Squint test",
    note: "Check visual hierarchy by reducing detail. Blur the artwork and see which elements remain clear at a glance.",
    Component: SquintTest,
  },
];
