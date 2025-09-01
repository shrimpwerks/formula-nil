import Track from "./Track";

export default class Race {
  id: string;
  name: string;
  track_id: string;

  constructor(id: string, name: string, track_id: string) {
    this.id = id;
    this.name = name;
    this.track_id = track_id;
  }

  track(): Track | undefined {
    return Track.find(this.track_id);
  }
}

