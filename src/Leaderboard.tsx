import { Car } from "./Car";
import { Race } from "./Race";

export default function ({ cars, race }: { cars: Car[]; race: Race }) {
  return (
    <div className="flex flex-col gap-2 m-2">
      <h1 className="text-white">{race.name}</h1>

      {cars
        .sort((a, b) => b.distanceTraveled - a.distanceTraveled)
        .map((car) => (
          <div className="text-white border-white border-1 p-3" key={car.id}>
            {car.name} <br />
            Speed: {(car.velocity.length() * 1000).toFixed(1)} <br />
            Max Speed: {(car.maxSpeed * 1000).toFixed(1)} <br />
            Distance: {Math.round(car.distanceTraveled)} <br />
            Acceleration: {car.accelFactor.toFixed(2)}x <br />
            Drag: {car.dragFactor.toFixed(2)}x <br />
            Brake Force: {car.brakeForce.toFixed(2)}x <br />
            Laps: {car.laps} / {race.laps}
          </div>
        ))}
    </div>
  );
}
