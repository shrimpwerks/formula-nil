const _data: { id: string; name: string, tagline: string }[] = [
  {
    id: "3372c824-d744-46b8-91d7-93c8df0a7925",
    name: "Scuderia Spaghetti",
    tagline: "Fast, but only in the straights between espresso stops."
  },
  {
    id: "56745b5d-f592-4ab8-b3b6-2dc3fc5e99dc",
    name: "Red Bison Racing",
    tagline: "Like Red Bull, but the wings are duct-taped on."
  },
  {
    id: "50f80b1e-50a9-4ffd-ab0e-ba1ab322ec92",
    name: "McFlaren International",
    tagline: "Innovating excuses faster than cars.",
  },
  {
    id: "5908011e-0a31-47cf-8802-ceed6dc69ec0",
    name: "Mercedes-Bends GP",
    tagline: "Bending rules and budget caps since day one."
  },
  {
    id: "ce2df525-61bd-4adf-bd2f-35118254c40b",
    name: "Ferraro Rosso Corse",
    tagline: "Glorious heritage of crashing in style"
  },
  {
    id: "ff05fb45-d4f6-4a9d-ae47-ecebb88fc8fe",
    name: "Alphonso Romeo Pizza",
    tagline: "The sausage sponsor makes more horsepower than our car."
  },
  {
    id: "17a3ee79-3c67-4120-a7ad-a896c65b771b",
    name: "Haas-Beens F1 Team",
    tagline: "Still searching for a points finish."
  },
  {
    id: "775b59da-504a-4db9-95d4-b30e708f2037",
    name: "Williams-Sonoma Racing",
    tagline: "The slowest car, but at least the catering is exquisite."
  },
];

export default class Team {
  id: string;
  name: string;
  tagline: string;

  constructor(id: string, name: string, tagline: string) {
    this.id = id;
    this.name = name;
    this.tagline = tagline;
  }

  static all(): Team[] {
    return _data.map((team) => new Team(team.id, team.name, team.tagline));
  }

  static find(id: string): Team | undefined {
    return _data.find((team) => team.id === id);
  }
}
