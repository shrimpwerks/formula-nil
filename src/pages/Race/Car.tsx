import Driver from "../../db/Driver";
import Vector2D from "../../db/Vector2D";

export function randomColor(): number {
  return Math.floor(Math.random() * 0xffffff);
}

export interface Car {
  id: number;
  driver: Driver;
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
  const BASE_ACCEL_FACTOR = 0.5; // max accel factor for slowest car
  const accelFactor = BASE_ACCEL_FACTOR * (1 - normalizedSpeed);

  const dragFactor = 0.8 * Math.random();
  const brakeForce = 0.05 + Math.random();

  return {
    id: id,
    driver: driver,
    acceleration: Vector2D.zero(),
    velocity: Vector2D.zero(),
    color: randomColor(),
    pos: startingPos,
    accelFactor: accelFactor,
    maxSpeed: rawMaxSpeed,
    dragFactor: dragFactor,
    brakeForce: brakeForce,
    segmentIdx: 1,
    distanceTraveled: 0,
  };
}

function updateCarWithTarget(
  car: Car,
  target: Vector2D,
  distanceToTarget: number,
  nextSegmentIdx: number,
): Car {
  const trackDir = target.clone().subtract(car.pos).normalized();

  const velMag = car.velocity.length();
  const velDir = velMag === 0 ? trackDir : car.velocity.clone().normalized();
  const alignmentDot = velDir.dot(trackDir);
  const penalty = Math.max(0, 1 - alignmentDot);

  // TODO: This should factor in optimal speed for turn
  const slowdownDistance = car.brakeForce;
  const slowdownFactor =
    distanceToTarget < slowdownDistance
      ? distanceToTarget / slowdownDistance
      : 1;

  const accel = (car.accelFactor ?? 1) * (1 - 0.5 * penalty) * slowdownFactor;
  const acceleration = trackDir.multiplyScalar(accel);

  // Make steering inversely correlated to speed - faster cars turn slower
  const baseSteeringGain = 0.3;
  const speedFactor = Math.min(1, velMag / car.maxSpeed); // 0 to 1 based on speed
  const STEERING_GAIN = baseSteeringGain * (1 - speedFactor * 0.7); // Reduce by up to 70% at max speed

  let newVel = car.velocity.add(acceleration);
  newVel.x += (trackDir.x * velMag - newVel.x) * STEERING_GAIN;
  newVel.y += (trackDir.y * velMag - newVel.y) * STEERING_GAIN;
  newVel.x -= newVel.x * car.dragFactor * penalty;
  newVel.y -= newVel.y * car.dragFactor * penalty;
  newVel = newVel.limitLength(car.maxSpeed);

  const newPos = car.pos.clone().add(newVel);
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

function selectCarTarget(
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

export function updateCar(trackPoints: Vector2D[], car: Car): Car {
  const { target, nextSegmentIdx, distanceToTarget } = selectCarTarget(
    trackPoints,
    car,
  );
  return updateCarWithTarget(car, target, distanceToTarget, nextSegmentIdx);
}
