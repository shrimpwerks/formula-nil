export const drivers: Driver[] = [
  // { id: "05cef7ec-8c63-4efd-9952-e72a73077dad", name: "Jonah", image: "jonah.png" },
  { id: "8f762024-3641-4a8f-9e96-3ab45990367b", name: "Jean", surname: "Molinari", image: "john.png" },
  { id: "01dd85ee-33ad-478a-bfab-6786e6cfe701", name: "Ty", surname: "Scheletoni", image: "ty.png" },
  { id: "9ff23d9d-578d-4b64-8cba-dd0510f807bf", name: "Nick", surname: "Barrantesi", image: "nick.png" },
  // { id: "bb245942-8add-4837-a728-e3acb34811d8", name: "Ryan", image: "ryan.png" },
  { id: "906def5d-8522-4c35-91fd-7574db1c0ee4", name: "Brett", surname: "Breckenridgi", image: "brett.png" },
  // { id: "b62c3af1-3b0d-409e-a2c8-35b5bfe729ab", name: "Eli", image: "eli.png" },
  { id: "c339b3f4-800e-4d0c-957f-1f239ea3534a", name: "Trung", surname: "Fanelli", image: "trung.png" },
  { id: "96f17682-84e5-4692-b58c-833d8dfb9130", name: "Rhett", surname: "Diemotti", image: "rhett.png" },
  { id: "0a81865c-bb09-44ab-923f-3a6044e8e89b", name: "Heather", surname: "Daliberti", image: "heather.png" },
  { id: "8b4704c5-d182-49d0-8ceb-f42660255f6a", name: "Lance", surname: "Concolini", image: "lance.png" },
  { id: "421f3306-e59a-40a1-8a3e-dff9ddfd23b6", name: "Tristan", surname: "Harelli", image: "tristan.png" },
  // { id: "d924c03d-9ce0-45d8-ac32-a9b7524324df", name: "Kyler", image: "kyler.png" },
  { id: "01f544ee-1593-430c-b2d7-d844d307d238", name: "Cooper", surname: "Giacchetti", image: "cooper.png" },
  // { id: "92fbc87f-82ec-42d2-9701-8956751071df", name: "Griffin", image: "griffin.png" },
  { id: "3e43810e-7ae1-41d9-9d2d-71bd389bb2ef", name: "Alea", surname: "McCauletti", image: "alea.png" },
  { id: "dff9a237-5d4f-4810-921c-f5b7820540e3", name: "Trevor", surname: "Ferretti", image: "trevor.png" },
  { id: "14c407ed-7c0a-4fee-9aff-ab9edfc90d33", name: "Shane", surname: "Barrantesi", image: "shane.png" },
  { id: "ec10fe45-b428-49e9-8aef-656caedc8156", name: "Grace", surname: "Giacchetti", image: "grace.png" },
];

export default class Driver {
  id: string;
  name: string;
  surname: string;
  image?: string;

  constructor(id: string, name: string, surname: string, image?: string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.image = image;
  }

  fullname() {
    return `${this.name} ${this.surname}`;
  }

  static find(id: string): Driver | undefined {
    return this.all().find((driver) => driver.id === id);
  }

  static all(): Driver[] {
    return drivers.map(
      (driver) => new Driver(driver.id, driver.name, driver.surname, driver.image),
    );
  }
}
