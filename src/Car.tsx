import { Driver } from "./data";
import { Vector2D } from "./Vector2D";

export function randomColor(): number {
  return Math.floor(Math.random() * 0xffffff);
}

export function randomSpeed(): number {
  return 0.0008 + Math.random() * 0.0004;
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

  laps: number;
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
    laps: 0,
    distanceTraveled: 0,
  };
}

/**
 * Update one car given raw track vertices (no interpolation).
 * ───────────────────────────────────────────────────────────
 * Car fields required:
 *   pos          : current world-space position   { x , y }
 *   velocity     : current velocity vector        { x , y }
 *   acceleration : last frame’s accel (for UI)    { x , y }
 *   segmentIdx   : integer index of the *next* track point to aim at
 *   accelFactor  : per-car throttle multiplier
 *   distance     : optional – total pixels driven (for stats / progress UI)
 */
export function updateCar(trackPoints: Vector2D[], car: Car) {
  if (trackPoints.length < 2) return car;

  const targetPt = trackPoints[car.segmentIdx];
  const distanceToTarget = car.pos.distanceTo(targetPt);

  const REACHED_EPS = 5;
  let nextSegmentIdx = car.segmentIdx;

  if (distanceToTarget <= REACHED_EPS) {
    nextSegmentIdx =
      car.segmentIdx + 1 < trackPoints.length
        ? car.segmentIdx + 1
        : trackPoints.length - 1;
  }

  const target = trackPoints[nextSegmentIdx];
  const directionVector = target.subtract(car.pos);
  const trackDir = directionVector.normalized();

  /* ---------- Steering alignment ---------- */
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

  /* ---------- Adjust velocity to aggressively steer ---------- */
  const DRAG_K = 0.05 * car.dragFactor;
  let newVel = car.velocity.add(acceleration);

  // --- Strongly steer towards trackDir
  const STEERING_GAIN = 0.2; // Increase for sharper turns (try 0.2–0.5)
  newVel.x += (trackDir.x * velMag - newVel.x) * STEERING_GAIN;
  newVel.y += (trackDir.y * velMag - newVel.y) * STEERING_GAIN;

  // Apply drag with penalty
  newVel.x -= newVel.x * DRAG_K * penalty;
  newVel.y -= newVel.y * DRAG_K * penalty;

  newVel = newVel.limitLength(car.maxSpeed);

  /* ---------- Update position ---------- */
  const newPos = car.pos.add(newVel);

  const distanceThisFrame = car.pos.distanceTo(newPos);
  const newDistanceTraveled = car.distanceTraveled + distanceThisFrame;

  return {
    ...car,
    pos: newPos,
    velocity: newVel,
    acceleration: acceleration,
    segmentIdx: nextSegmentIdx,
    distanceTraveled: newDistanceTraveled,
  };
}
