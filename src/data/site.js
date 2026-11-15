// Everything a visitor reads about you lives here. Edit copy in this file,
// not in the components.

export const site = {
  name: "Mumtaz Che Ismail",
  shortName: "Mumtaz",
  role: "Full-stack Laravel developer & DevOps engineer",
  location: "Putrajaya, Malaysia",
  timeZone: "Asia/Kuala_Lumpur",
  timeZoneLabel: "MYT",
  url: "https://mumtaaz.xyz",
  email: "mumtaz.che.ismail@gmail.com",

  // Flip to false to swap the green "open" badge for a neutral one.
  available: true,
  availabilityLabel: "Open to full-time and freelance",
  unavailableLabel: "Booked for now",

  // Getform endpoint the contact form posts to.
  formEndpoint: "https://getform.io/f/0ba479c0-db9e-4462-b74c-c445d2652a3b",

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mumtaz-che-ismail/" },
    { label: "GitHub", href: "https://github.com/aremanzh" },
    { label: "Instagram", href: "https://www.instagram.com/ismi_mumtaz/" },
  ],
};

export const about = {
  statement:
    "I’m Mumtaz. I studied fine arts, then learned to run Kubernetes clusters, and I still care about both ends of the job. I design the Laravel backend, build the front end in Vue or React, put it in a container, and keep it running in production.",
  facts: [
    { label: "Based in", value: "Putrajaya, Malaysia" },
    { label: "Focus", value: "Laravel, Kubernetes, CI/CD" },
    { label: "Certified", value: "Kubernetes Administrator (CKA)" },
    { label: "Studied", value: "Fine Arts, Universiti Sains Malaysia" },
  ],
};

// The three stages mirror the hero line: build it, ship it, keep it up.
export const pipeline = [
  {
    id: "build",
    name: "Build",
    summary:
      "Laravel backends with explicit, readable architecture, and a Vue or React front end on top. Code the next developer can pick up without a tour.",
    tools: ["Laravel", "PHP", "Vue", "React", "Tailwind CSS", "MySQL", "MongoDB"],
  },
  {
    id: "ship",
    name: "Ship",
    summary:
      "Every change is built into an image and pushed through a pipeline, so a release is a repeatable step and not an event.",
    tools: ["Docker", "GitLab CI", "Jenkins"],
  },
  {
    id: "run",
    name: "Run",
    summary:
      "Kubernetes workloads, reverse proxies and Linux hosts, operated with uptime and observability ahead of feature speed.",
    tools: ["Kubernetes", "Nginx", "Apache", "Linux"],
  },
];

export const marquee = [
  "Laravel",
  "Kubernetes",
  "Vue",
  "Docker",
  "React",
  "GitLab CI",
  "PHP",
  "Jenkins",
  "Tailwind CSS",
  "Nginx",
  "MySQL",
  "Linux",
];
