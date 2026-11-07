import lumavue from "../assets/work/lumavue-cream.webp";
import vibex from "../assets/work/vibex-can.webp";
import tvanamm from "../assets/work/tvanamm-lavender.webp";
import { pick } from "../lib/assets";
import factoryOutlet from "../assets/work/factory-outlet-logo.png";

/*
 * Case-study copy describes what is visible on each piece of artwork.
 * Hotspot x / y are percentages of the image. Edit freely.
 */
export const projects = [
  {
    id: "lumavue",
    name: "LumaVue",
    kind: "Skincare, concept brand and packaging",
    image: lumavue,
    alt: "LumaVue Glow Renewal Cream tube on a travertine slab with glass props and soft window light",
    width: 1000,
    height: 1500,
    statement:
      "A skincare identity built on quiet confidence. The wordmark runs up the tube like a spine, and every other line on the label steps down in size and weight from it.",
    palette: [
      { hex: "#F0D6CA", name: "Blush tube" },
      { hex: "#DCB7A0", name: "Warm wall" },
      { hex: "#BA896A", name: "Travertine" },
      { hex: "#867E3A", name: "Leaf" },
      { hex: "#2C3A2E", name: "Wordmark ink" },
    ],
    hotspots: [
      { x: 56, y: 32, title: "Wordmark", text: "Set vertically along the tube. It is the largest element and the only dark one on a pale blush ground, so it reads first." },
      { x: 50, y: 51, title: "Product name", text: "“Glow Renewal Cream” sits one clear step down, with the benefit line “Brightens & Hydrates” directly beneath it." },
      { x: 50, y: 57.5, title: "Active ingredients", text: "Encapsulated Vitamin C and Tri-Peptide Complex are named in the smallest type, for readers who lean in." },
      { x: 50, y: 63.5, title: "Net content", text: "30ml / 1.01 fl. oz. stays quiet and centred, where it is expected, without competing for attention." },
      { x: 50, y: 74, title: "Cap", text: "A clean white cap with a finger notch keeps the base light and grounds the pale tube." },
    ],
  },
  {
    id: "vibex",
    name: "VIBE X",
    kind: "Energy drink, brand identity and can design",
    image: vibex,
    alt: "VIBE X Plasma Citrus Flavor energy drink can tilted on a violet background with lightning",
    width: 1000,
    height: 1250,
    statement:
      "Loud on purpose. A violet can, a lime lightning X and a wordmark stacked vertically so it reads at speed. Flavour and specs stay in a small, tidy block underneath.",
    palette: [
      { hex: "#350B55", name: "Voltage violet" },
      { hex: "#6E5C9B", name: "Can body" },
      { hex: "#D6F23F", name: "Lime" },
      { hex: "#0B0B0F", name: "Black type" },
    ],
    hotspots: [
      { x: 64, y: 37, title: "The X", text: "The X carries a lightning bolt, so the name and the idea of voltage land in a single glyph." },
      { x: 74, y: 29, title: "Descriptor", text: "“Unleash Energy. No Limits.” runs alongside the mark in a lighter weight." },
      { x: 56, y: 54, title: "Flavour", text: "“Plasma” in black, “Citrus Flavor” in lime. Colour separates the name from the variant." },
      { x: 55, y: 58.5, title: "Specs", text: "200mg caffeine, zero sugar, B12 boost and 355ml are set small and on one line." },
      { x: 31, y: 34, title: "Campaign line", text: "“Fuel your vibe. Unleash the volts.” is turned to the can’s angle, so the layout moves with the product." },
    ],
  },
  {
    id: "tvanamm",
    name: "Tvanamm",
    kind: "Herbal tea, packaging design",
    image: tvanamm,
    alt: "Tvanamm Lavender tea box on a stone slab surrounded by lavender and a cup of tea",
    width: 1000,
    height: 1250,
    statement:
      "A lavender tea box built from three clear layers: a deep violet shell, a white arched label and a gold keyline that frames the brand. The side panel takes the small print so the front can stay calm.",
    palette: [
      { hex: "#5B3A99", name: "Lavender violet" },
      { hex: "#2B1654", name: "Deep violet" },
      { hex: "#E6E6E4", name: "Label white" },
      { hex: "#C9A24B", name: "Gold keyline" },
      { hex: "#A88970", name: "Stone" },
    ],
    hotspots: [
      { x: 64, y: 56, title: "Wordmark", text: "T VANAMM and its leaf-and-cup emblem sit at the top of the white arch, the first thing the eye lands on." },
      { x: 53, y: 64, title: "Variant name", text: "“Lavender” is set in a violet serif that ties the flavour to the colour of the box." },
      { x: 55, y: 69, title: "Benefits", text: "Two short claims, “Reduces inflammation” and “Boost immune system”, with small icons for quick scanning." },
      { x: 33, y: 50, title: "Side panel", text: "Brewing steps and the nutrition table live here, so the front face stays uncluttered." },
      { x: 53, y: 37, title: "Lid emblem", text: "The emblem repeats on the lid, so the brand still shows when the box is seen from above." },
    ],
  },
];

/* The company group: JKSH is the parent of Tvanamm and T Leaf. */
export const group = {
  parent: "JKSH United Private Limited",
  children: [
    { name: "Tvanamm", note: "packaging", target: "tvanamm" },
    { name: "T Leaf", note: "logo, identity", target: "more" },
  ],
};

/*
 * Bento tiles. Images are found by file name in src/assets/work (see lib/assets.js).
 * kind: "logo" shows on a light panel, "post" fills the tile.
 */
const FEED = /instagram|feed|screenshot/i;

export const more = [
  {
    id: "jksh",
    name: "JKSH",
    full: "JKSH United Private Limited",
    tag: "Logo, parent company",
    kind: "logo",
    image: pick(/jksh/i),
    alt: "JKSH United Private Limited logo",
  },
  {
    id: "tleaf",
    name: "T Leaf",
    full: "T Leaf",
    tag: "Logo, brand identity",
    kind: "logo",
    image: pick(/t[-_ ]?leaf/i),
    alt: "T Leaf logo",
  },
  {
    id: "hireready",
    name: "Hire Ready",
    full: "Hire Ready",
    tag: "Logo",
    kind: "logo",
    image: pick(/hire/i),
    alt: "Hire Ready logo",
  },
  {
    id: "verifyshield",
    name: "Verify Shield",
    full: "Verify Shield",
    tag: "Sample post",
    kind: "post",
    image: pick(/verify/i),
    alt: "Verify Shield social media post",
  },
  {
    id: "nirvista-post",
    name: "Nirvista",
    full: "Nirvista",
    tag: "Sample post",
    kind: "post",
    image: pick(/nirvista/i, FEED),
    alt: "Nirvista social media post",
  },
  {
    id: "nirvista-feed",
    name: "SSBA Factory Outlet",
    full: "SSBA Factory Outlet",
    tag: "Logo design",
    kind: "logo",
    image: factoryOutlet,
    alt: "SSBA Factory Outlet logo in orange and white",
  },
];
