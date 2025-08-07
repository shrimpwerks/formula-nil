import { Car } from "./Car";
import { Race } from "./Race";

export default function ({ cars, race }: { cars: Car[]; race: Race }) {
  return (
    <div className="flex flex-col gap-2 m-2">
      <h1 className="text-white">{race.name}</h1>

      {cars
        .sort((a, b) => b.progress - a.progress)
        .map((car) => (
          <div className="text-white border-white border-1 p-3" key={car.id}>
            {car.name} <br />
            Speed: {car.velocity.x}, {car.velocity.y} <br />
            X: {Math.round(car.pos.x)}, Y: {Math.round(car.pos.y)} <br />
            Laps: {car.laps} / {race.laps}
            <br />
            Progress: {car.progress.toFixed(2)}
          </div>
        ))}
    </div>
  );
}
