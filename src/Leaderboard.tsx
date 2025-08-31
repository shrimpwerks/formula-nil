import { Car } from "./Car";
import { Race } from "./Race";

export default function ({ cars, race }: { cars: Car[]; race: Race }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-white">{race.name}</h1>

      {cars
        .sort((a, b) => b.distanceTraveled - a.distanceTraveled)
        .map((car, index) => (
          <details
            className="text-white border-white border-1 p-1"
            key={car.id}
          >
            <summary className="cursor-pointer flex items-center gap-2">
              {car.image && (
                <img
                  src={`/images/${car.image}`}
                  alt={car.name}
                  className="w-12 h-12 object-cover"
                />
              )}
              <span>
                #{index + 1} {car.name} {car.surname}
              </span>
            </summary>
            <div className="mt-2 ml-4">
              Speed: {(car.velocity.length() * 1000).toFixed(1)} <br />
              Max Speed: {(car.maxSpeed * 1000).toFixed(1)} <br />
              Distance: {Math.round(car.distanceTraveled)} <br />
              Acceleration: {car.accelFactor.toFixed(2)}x <br />
              Drag: {car.dragFactor.toFixed(2)}x <br />
              Brake Force: {car.brakeForce.toFixed(2)}x <br />
            </div>
          </details>
        ))}
    </div>
  );
}
