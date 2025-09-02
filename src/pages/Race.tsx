import { useState } from "react";
import Driver from "../db/Driver";
import Race from "../db/Race";
import Vector2D from "../db/Vector2D";
import { Car, newCar } from "./Race/Car";
import Leaderboard from "./Race/Leaderboard";
import Map from "./Race/Map";

export default function () {
  const [cars, setCars] = useState<Car[]>([]);
  const race: Race = new Race(
    "c1530a2b-0c9c-4313-a6a6-2e7dd354ca82",
    "Portland International Raceway",
    "560cb995-ea6c-41da-8e33-a5bf4d2d7cb4",
  );

  // Initialize cars with track positions
  const initializeCarsOnTrack = (trackPoints: Vector2D[]) => {
    if (trackPoints.length === 0) return;

    const startPointIndex = 0; // All cars start at the first track point
    const startPosition = trackPoints[startPointIndex];

    setCars(
      Driver.all().map((driver, idx) =>
        newCar(idx, driver, new Vector2D(startPosition.x, startPosition.y)),
      ),
    );
  };

  return (
    <>
      <div className="w-2/3 mx-auto">
        <Map
          race={race}
          cars={cars}
          setCars={setCars}
          onTrackGenerated={initializeCarsOnTrack}
        />
      </div>

      <Leaderboard race={race} cars={cars} />
    </>
  );
}
