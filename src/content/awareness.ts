// GPOC Health & Safety team: please review this wording before launch.
// This is the only place the public Ebola awareness copy lives — the
// landing page renders it directly from here.

export type AwarenessSection = {
  title: string;
  intro?: string;
  items: string[];
};

export const awarenessSections: AwarenessSection[] = [
  {
    title: "What it is",
    items: [
      "A severe, often fatal disease caused by a virus that spreads between people.",
    ],
  },
  {
    title: "How it spreads",
    items: [
      "Direct contact with blood or body fluids (vomit, saliva, urine, faeces, sweat) of a sick person or someone who died from Ebola.",
      "Contaminated objects such as bedding and needles.",
      "Infected animals.",
      "It does not spread through the air.",
    ],
  },
  {
    title: "Symptoms",
    intro: "Symptoms appear 2 to 21 days after exposure.",
    items: [
      "Fever.",
      "Severe headache.",
      "Muscle and joint pain.",
      "Weakness and fatigue.",
      "Vomiting and diarrhoea.",
      "Unexplained bleeding or bruising.",
    ],
  },
  {
    title: "Prevention",
    items: [
      "Wash hands often with soap, or use sanitiser.",
      "Avoid contact with sick people and their body fluids.",
      "Avoid funerals and burial rituals involving body contact.",
      "Avoid bushmeat.",
      "Follow your site's health guidance.",
    ],
  },
  {
    title: "If you feel unwell",
    items: [
      "Stop travel, isolate yourself from others, and call the GPOC clinic or the Ministry of Health toll-free line immediately.",
      "Do not go to work.",
    ],
  },
];
