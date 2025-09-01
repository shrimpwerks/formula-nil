export const drivers: Driver[] = [
  // { name: "Jonah", image: "jonah.png" },
  { name: "Jean", surname: "Molinari", image: "john.png" },
  { name: "Ty", surname: "Scheletoni", image: "ty.png" },
  { name: "Nick", surname: "Barrantesi", image: "nick.png" },
  // { name: "Ryan", image: "ryan.png" },
  { name: "Brett", surname: "Breckenridgi", image: "brett.png" },
  // { name: "Eli", image: "eli.png" },
  { name: "Trung", surname: "Fanelli", image: "trung.png" },
  { name: "Rhett", surname: "Diemotti", image: "rhett.png" },
  { name: "Heather", surname: "Daliberti", image: "heather.png" },
  { name: "Lance", surname: "Concolini", image: "lance.png" },
  { name: "Tristan", surname: "Harelli", image: "tristan.png" },
  // { name: "Kyler", image: "kyler.png" },
  { name: "Cooper", surname: "Giacchetti", image: "cooper.png" },
  // { name: "Griffin", image: "griffin.png" },
  { name: "Alea", surname: "McCauletti", image: "alea.png" },
  { name: "Trevor", surname: "Ferretti", image: "trevor.png" },
  { name: "Shane", surname: "Barrantesi", image: "shane.png" },
  { name: "Grace", surname: "Giacchetti", image: "grace.png" },
];

export default class Driver {
  name: string;
  surname: string;
  image?: string;

  constructor(name: string, surname: string, image?: string) {
    this.name = name;
    this.surname = surname;
    this.image = image;
  }

  static all(): Driver[] {
    return drivers.map(
      (driver) => new Driver(driver.name, driver.surname, driver.image),
    );
  }
}
