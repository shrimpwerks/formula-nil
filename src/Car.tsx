import { Driver } from "./data";
import { Vector2D } from "./Vector2D";

export function randomColor(): number {
  return Math.floor(Math.random() * 0xffffff);
}

export interface Car {
  id: number;
  name: string;
  color: number;

  acceleration: Vector2D;
  pos: Vector2D;
  velocity: Vector2D;
  accelFactor: number;
  maxSpeed: number;
  dragFactor: number;
  segmentIdx: number;
  brakeForce: number;

  distanceTraveled: number;
}

export function newCar(id: number, driver: Driver, startingPos: Vector2D): Car {
  const minSpeed = 0.15;
  const maxSpeed = 0.165;
  const speedRange = maxSpeed - minSpeed;

  const rawMaxSpeed = minSpeed + Math.random() * speedRange;

  // Normalize maxSpeed to [0, 1]
  const normalizedSpeed = (rawMaxSpeed - minSpeed) / speedRange;

  // Invert normalizedSpeed to compute accelFactor (higher speed → lower accel)
  const BASE_ACCEL_FACTOR = 0.75; // max accel factor for slowest car
  const accelFactor = BASE_ACCEL_FACTOR * (1 - normalizedSpeed);

  return {
    id: id,
    name: driver.name,
    acceleration: new Vector2D(0, 0),
    velocity: new Vector2D(0, 0),
    color: randomColor(),
    pos: new Vector2D(startingPos.x, startingPos.y),
    accelFactor: accelFactor,
    maxSpeed: rawMaxSpeed,
    dragFactor: 0.8 + Math.random() * 0.4,
    brakeForce: 0.5 + Math.random() * 0.5,
    segmentIdx: 1,
    distanceTraveled: 0,
  };
}

export function selectCarTarget(
  trackPoints: Vector2D[],
  car: Car,
): {
  target: Vector2D;
  nextSegmentIdx: number;
  distanceToTarget: number;
} {
  if (trackPoints.length < 2) {
    return {
      target: car.pos,
      nextSegmentIdx: car.segmentIdx,
      distanceToTarget: 0,
    };
  }

  const currentTarget = trackPoints[car.segmentIdx];
  const distanceToTarget = car.pos.distanceTo(currentTarget);

  const REACHED_EPS = 5;
  const nextSegmentIdx =
    distanceToTarget <= REACHED_EPS
      ? Math.min(car.segmentIdx + 1, trackPoints.length - 1)
      : car.segmentIdx;

  const target = trackPoints[nextSegmentIdx];

  return {
    target,
    nextSegmentIdx,
    distanceToTarget,
  };
}

export function updateCarWithTarget(
  car: Car,
  target: Vector2D,
  distanceToTarget: number,
  nextSegmentIdx: number,
): Car {
  const directionVector = target.subtract(car.pos);
  const trackDir = directionVector.normalized();

  const velMag = car.velocity.length();
  const velDir = velMag === 0 ? trackDir : car.velocity.normalized();
  const alignmentDot = velDir.dot(trackDir);
  const penalty = Math.max(0, 1 - alignmentDot);

  const BASE_ACCEL = 0.0006;
  const slowdownDistance = 200 * car.brakeForce;
  const slowdownFactor =
    distanceToTarget < slowdownDistance
      ? distanceToTarget / slowdownDistance
      : 1;

  const accel =
    BASE_ACCEL * (car.accelFactor ?? 1) * (1 - 0.5 * penalty) * slowdownFactor;

  const acceleration = trackDir.multiplyScalar(accel);

  const DRAG_K = 0.05 * car.dragFactor;
  let newVel = car.velocity.add(acceleration);

  const STEERING_GAIN = 0.2;
  newVel.x += (trackDir.x * velMag - newVel.x) * STEERING_GAIN;
  newVel.y += (trackDir.y * velMag - newVel.y) * STEERING_GAIN;

  newVel.x -= newVel.x * DRAG_K * penalty;
  newVel.y -= newVel.y * DRAG_K * penalty;

  newVel = newVel.limitLength(car.maxSpeed);

  const newPos = car.pos.add(newVel);
  const distanceThisFrame = car.pos.distanceTo(newPos);
  const newDistanceTraveled = car.distanceTraveled + distanceThisFrame;

  return {
    ...car,
    pos: newPos,
    velocity: newVel,
    acceleration,
    segmentIdx: nextSegmentIdx,
    distanceTraveled: newDistanceTraveled,
  };
}

export function updateCar(trackPoints: Vector2D[], car: Car): Car {
  const { target, nextSegmentIdx, distanceToTarget } = selectCarTarget(
    trackPoints,
    car,
  );
  return updateCarWithTarget(car, target, distanceToTarget, nextSegmentIdx);
}
