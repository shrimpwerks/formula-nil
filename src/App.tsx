import { useState } from "react";
import { drivers } from "./data";
import { Car, newCar } from "./Car";
import Map from "./Map";
import Leaderboard from "./Leaderboard";
import { Race } from "./Race";
import { Vector2D } from "./Vector2D";

export default function () {
  const [cars, setCars] = useState<Car[]>([]);
  const race: Race = {
    name: "Portland International Raceway",
  };

  // Initialize cars with track positions
  const initializeCarsOnTrack = (trackPoints: Vector2D[]) => {
    if (trackPoints.length === 0) return;

    const startPointIndex = 0; // All cars start at the first track point
    const startPosition = trackPoints[startPointIndex];

    setCars(
      drivers.map((driver, idx) =>
        newCar(idx, driver, new Vector2D(startPosition.x, startPosition.y)),
      ),
    );
  };

  return (
    <>
      <h1 className="text-white">Formula Nil</h1>

      <div className="flex">
        <div className="w-2/3">
          <Map
            race={race}
            cars={cars}
            setCars={setCars}
            onTrackGenerated={initializeCarsOnTrack}
          />
        </div>

        <div className="w-1/3">
          <Leaderboard race={race} cars={cars} />
        </div>
      </div>
    </>
  );
}
