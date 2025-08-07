import { useState, useEffect } from "react";
import { Car, names, randomColor, randomSpeed } from "./Car";
import Map from "./Map";
import Leaderboard from "./Leaderboard";
import { Race } from "./Race";

export default function () {
  const [cars, setCars] = useState<Car[]>([]);
  const [race, setRace] = useState<Race>({
    name: "Portland International Raceway",
    laps: 6,
  });

  // Initialize cars with track positions
  const initializeCarsOnTrack = (trackPoints: { x: number; y: number }[]) => {
    if (trackPoints.length === 0) return;

    const carsList: Car[] = [];
    const carCount = 7;
    const startPointIndex = 0; // All cars start at the first track point
    const startPosition = trackPoints[startPointIndex];

    for (let i = 0; i < carCount; i++) {
      carsList.push({
        id: i,
        name: names[i],
        acceleration: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        color: randomColor(),
        pos: { x: startPosition.x, y: startPosition.y },
        accelFactor: 1 + Math.random(),
        maxSpeed: 0.015 + Math.random() * 0.015, // 0.015 to 0.03
        dragFactor: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
        segmentIdx: 1, // Target the next point after start
        laps: 0,
        distanceTraveled: 0,
      });
    }
    setCars(carsList);
  };

  return (
    <>
      <h1 className="text-white">Formula Nil</h1>

      <div className="flex m-2">
        <Map
          race={race}
          cars={cars}
          setCars={setCars}
          onTrackGenerated={initializeCarsOnTrack}
        />

        <Leaderboard race={race} cars={cars} />
      </div>
    </>
  );
}
