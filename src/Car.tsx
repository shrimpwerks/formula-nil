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
  maxSpeed: number;
  dragFactor: number;
  segmentIdx: number;

  laps: number;
  distanceTraveled: number;
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

export function distance(a: Vector2D, b: Vector2D): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function magnitude(vector: Vector2D): number {
  return Math.hypot(vector.x, vector.y);
}

export function normalize(vector: Vector2D): Vector2D {
  const mag = magnitude(vector);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: vector.x / mag, y: vector.y / mag };
}

export function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function dot(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

export function clampMagnitude(
  vector: Vector2D,
  maxMagnitude: number,
): Vector2D {
  const mag = magnitude(vector);
  if (mag > maxMagnitude) {
    return {
      x: (vector.x / mag) * maxMagnitude,
      y: (vector.y / mag) * maxMagnitude,
    };
  }
  return vector;
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
  /* ---------- 0. Bail-outs ---------- */
  if (trackPoints.length < 2) return car; // need at least a segment

  const targetPt = trackPoints[car.segmentIdx]; // point to chase
  const distanceToTarget = distance(car.pos, targetPt);

  /* ---------- 1.  If we've reached the target, switch to the next ---------- */
  const REACHED_EPS = 1; // pixels tolerance
  let nextSegmentIdx = car.segmentIdx;

  if (distanceToTarget <= REACHED_EPS) {
    // Pick the following vertex (wrap for closed loop, clamp for open track)
    nextSegmentIdx =
      car.segmentIdx + 1 < trackPoints.length
        ? car.segmentIdx + 1
        : trackPoints.length - 1; // clamp at end
  }

  // Re-compute direction with (possibly) new target
  const target = trackPoints[nextSegmentIdx];
  const directionVector = subtract(target, car.pos);
  const trackDir = normalize(directionVector);

  /* ---------- 2.  Acceleration & steering penalty ---------- */
  const velMag = magnitude(car.velocity);
  const velDir = velMag === 0 ? trackDir : normalize(car.velocity);

  const alignmentDot = dot(velDir, trackDir);
  const penalty = Math.max(0, 1 - alignmentDot); // 0 (aligned) … 2 (reverse)

  const BASE_ACCEL = 0.0006;
  const accel = BASE_ACCEL * (car.accelFactor ?? 1) * (1 - 0.5 * penalty);

  const acceleration = {
    x: trackDir.x * accel,
    y: trackDir.y * accel,
  };

  /* ---------- 3.  Velocity integration + drag ---------- */
  const DRAG_K = 0.005 * car.dragFactor;
  let newVel = {
    x: car.velocity.x + acceleration.x,
    y: car.velocity.y + acceleration.y,
  };
  newVel.x -= newVel.x * DRAG_K * penalty;
  newVel.y -= newVel.y * DRAG_K * penalty;

  newVel = clampMagnitude(newVel, car.maxSpeed);

  /* ---------- 4.  Position & distance ---------- */
  const newPos = { x: car.pos.x + newVel.x, y: car.pos.y + newVel.y };
  const distanceThisFrame = distance(car.pos, newPos);
  const newDistanceTraveled = car.distanceTraveled + distanceThisFrame;

  /* ---------- 5.  Return updated car ---------- */
  return {
    ...car,
    pos: newPos,
    velocity: newVel,
    acceleration: acceleration,
    segmentIdx: nextSegmentIdx, // advance when point reached
    distanceTraveled: newDistanceTraveled,
  };
}
