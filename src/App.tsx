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

  // Initialize track and cars
  useEffect(() => {
    // Create cars
    const carsList: Car[] = [];
    const carCount = 7;
    for (let i = 0; i < carCount; i++) {
      carsList.push({
        id: i,
        name: names[i],
        progress: 0,
        acceleration: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        color: randomColor(),
        pos: { x: 0, y: 0 },
        accelFactor: 1 + Math.random(),
        laps: 0,
      });
    }
    setCars(carsList);
  }, []);

  return (
    <>
      <h1 className="text-white">Formula Nil</h1>

      <div className="flex m-2">
        <Map race={race} cars={cars} setCars={setCars} />

        <Leaderboard race={race} cars={cars} />
      </div>
    </>
  );
}
