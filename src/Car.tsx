import { interpolate } from "./Map";

export interface Vector2D {
  x: number;
  y: number;
}

export interface Car {
  id: number;
  name: string;
  color: number;

  acceleration: Vector2D;
  pos: Vector2D;
  velocity: Vector2D;
  accelFactor: number;

  progress: number;
  laps: number;
}

export const names: string[] = [
  "Jonah",
  "John",
  "Ty",
  "Nick",
  "Ryan",
  "Bort",
  "Eli",
];

export function randomColor(): number {
  return Math.floor(Math.random() * 0xffffff);
}

export function randomSpeed(): number {
  return 0.0008 + Math.random() * 0.0004;
}

export function estimateTrackLength(points: Vector2D[]): number {
  let length = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length]; // wrap
    length += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return length;
}

export function updateCar(trackPoints: Vector2D[], car: Car) {
  /* ---------- 1 .  Where am I?  ---------- */
  const currentPos = interpolate(trackPoints, car.progress);

  /* look-ahead tangent: a small ε further along the track */
  const EPS = 1 / trackPoints.length; // ~one segment
  const lookAheadP = Math.min(car.progress + EPS, 1);
  const lookAhead = interpolate(trackPoints, lookAheadP);

  const dirDX = lookAhead.x - currentPos.x;
  const dirDY = lookAhead.y - currentPos.y;
  const dirLen = Math.hypot(dirDX, dirDY) || 1;
  const trackDir = { x: dirDX / dirLen, y: dirDY / dirLen };

  /* ---------- 2 .  Build acceleration ---------- */
  const velocityMag = Math.hypot(car.velocity.x, car.velocity.y);
  const velocityDir =
    velocityMag === 0
      ? trackDir
      : {
          x: car.velocity.x / velocityMag,
          y: car.velocity.y / velocityMag,
        };

  const dot = velocityDir.x * trackDir.x + velocityDir.y * trackDir.y; // –1 → 1
  const penalty = Math.max(0, 1 - dot); // 0 (aligned) … 2 (reverse)

  const BASE_ACCEL = 0.0006; // throttle per frame
  const accelTarget = BASE_ACCEL * (car.accelFactor ?? 1);
  const accelStrength = accelTarget * (1 - 0.5 * penalty); // lose up to 50 %

  const acceleration = {
    x: trackDir.x * accelStrength,
    y: trackDir.y * accelStrength,
  };

  /* ---------- 3 .  Update velocity ---------- */
  let newVelocity = {
    x: car.velocity.x + acceleration.x,
    y: car.velocity.y + acceleration.y,
  };

  /* extra drag when steering hard */
  const DRAG_K = 0.005;
  newVelocity.x -= newVelocity.x * DRAG_K * penalty;
  newVelocity.y -= newVelocity.y * DRAG_K * penalty;

  /* clamp speed */
  const maxVel = 0.02;
  const newVelMag = Math.hypot(newVelocity.x, newVelocity.y);
  if (newVelMag > maxVel) {
    newVelocity.x = (newVelocity.x / newVelMag) * maxVel;
    newVelocity.y = (newVelocity.y / newVelMag) * maxVel;
  }

  /* ---------- 4 .  Advance progress using *new* velocity ---------- */
  const trackLength = estimateTrackLength(trackPoints); // cache outside loop if you like
  const progressDelta = newVelMag / trackLength; // pixels → progress
  const newProgress = Math.min(car.progress + progressDelta, 1);
  const nextPos = interpolate(trackPoints, newProgress);

  /* ---------- 5 .  Return updated car ---------- */
  return {
    ...car,
    progress: newProgress,
    velocity: newVelocity,
    acceleration: acceleration,
    pos: nextPos,
  };
}
