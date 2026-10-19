// GPOC Health & Safety team: please review this wording before launch.
// This is the only place the public Ebola awareness copy lives — the
// landing page renders it directly from here. `icon` is a lucide-react
// icon name (see src/app/page.tsx for the lookup) — swap it for any other
// lucide icon name without touching the page itself.

export type AwarenessSection = {
  icon: string;
  title: string;
  intro?: string;
  items: string[];
};

export const awarenessSections: AwarenessSection[] = [
  {
    icon: "Info",
    title: "What it is",
    items: [
      "Ebola Virus Disease (EVD) is a severe, often fatal illness caused by the Ebola virus, first identified near the Ebola River in 1976.",
      "It affects humans and other primates, and outbreaks occur mainly in parts of Central and West Africa.",
      "Case fatality rates vary widely by outbreak and access to care, from roughly 25% to 90% — early supportive treatment significantly improves survival.",
    ],
  },
  {
    icon: "Share2",
    title: "How it spreads",
    items: [
      "Direct contact with blood or body fluids (vomit, saliva, urine, faeces, sweat, breast milk, semen) of a person who is sick or has died from Ebola.",
      "Contaminated objects such as bedding, clothing, needles, and medical equipment.",
      "Infected animals, through handling or eating bushmeat (especially bats and primates).",
      "A pregnant woman who survives can still carry the virus in certain body fluids for a time after recovery.",
      "It does not spread through air, water, or food in general, and a person is not infectious until symptoms appear.",
    ],
  },
  {
    icon: "Thermometer",
    title: "Symptoms",
    intro: "Symptoms typically appear 2 to 21 days after exposure (the incubation period).",
    items: [
      "Sudden fever, fatigue, and muscle pain.",
      "Severe headache and sore throat.",
      "Vomiting, diarrhoea, and abdominal pain.",
      "Rash, and symptoms of impaired kidney and liver function.",
      "In some cases, unexplained bleeding or bruising (internal or external).",
    ],
  },
  {
    icon: "ShieldCheck",
    title: "Prevention",
    items: [
      "Wash hands frequently with soap and water, or use an alcohol-based sanitiser.",
      "Avoid contact with the blood and body fluids of anyone who is sick, especially in a healthcare setting without proper protective equipment.",
      "Avoid funeral or burial practices that involve direct contact with the body of someone who has died from a suspected case.",
      "Avoid contact with bats and non-human primates, and avoid eating raw bushmeat.",
      "Follow your site's and the GPOC clinic's current health guidance, which may change as regional risk changes.",
    ],
  },
  {
    icon: "PhoneCall",
    title: "If you feel unwell",
    items: [
      "Stop travel immediately and isolate yourself from others as much as possible.",
      "Call the GPOC clinic or the Ministry of Health toll-free line right away — do not simply walk in without calling ahead.",
      "Do not go to work, and avoid public transport where possible.",
      "Be ready to describe your recent travel history and any contact with sick people.",
    ],
  },
];

export type QuickFact = {
  icon: string;
  label: string;
  value: string;
};

export const quickFacts: QuickFact[] = [
  { icon: "Clock", value: "2–21 days", label: "Incubation period" },
  { icon: "Droplets", value: "Direct contact", label: "Main transmission route" },
  { icon: "Wind", value: "Not airborne", label: "Does not spread through air" },
  { icon: "Globe2", value: "Central & West Africa", label: "Most affected regions" },
];

export const resourceLinks = [
  { name: "World Health Organization — Ebola disease", url: "https://www.who.int/health-topics/ebola" },
  { name: "US CDC — Ebola (Ebola Virus Disease)", url: "https://www.cdc.gov/ebola/" },
  { name: "Africa CDC — Outbreak alerts", url: "https://africacdc.org/" },
];
