import { Point } from "pixi.js";
import { Vector2D } from "./Vector2D";

export function generateTrackPoints(
  centerX: number,
  centerY: number,
  radius: number,
): Vector2D[] {
  const points: Vector2D[] = [];

  // Create characteristic F1 track features
  const trackFeatures = [
    { angle: 0, radius: radius * 1.2, type: "straight" },
    { angle: Math.PI * 0.15, radius: radius * 0.7, type: "tight" },
    { angle: Math.PI * 0.35, radius: radius * 0.8, type: "medium" },
    { angle: Math.PI * 0.5, radius: radius * 1.3, type: "straight" },
    { angle: Math.PI * 0.65, radius: radius * 0.6, type: "hairpin" },
    { angle: Math.PI * 0.8, radius: radius * 0.9, type: "medium" },
    { angle: Math.PI * 1.0, radius: radius * 1.1, type: "straight" },
    { angle: Math.PI * 1.2, radius: radius * 0.75, type: "chicane" },
    { angle: Math.PI * 1.35, radius: radius * 0.8, type: "chicane" },
    { angle: Math.PI * 1.5, radius: radius * 1.0, type: "medium" },
    { angle: Math.PI * 1.7, radius: radius * 0.85, type: "medium" },
    { angle: Math.PI * 1.85, radius: radius * 1.15, type: "straight" },
  ];

  // Generate points based on track features with randomness
  trackFeatures.forEach((feature, i) => {
    // Add random variation to radius (±15% of base radius)
    const radiusVariation = (Math.random() - 0.5) * 0.3 * radius;
    const randomRadius = feature.radius + radiusVariation;

    // Add slight random angle variation (±5 degrees)
    const angleVariation = (Math.random() - 0.5) * 0.175; // ~5 degrees in radians
    const randomAngle = feature.angle + angleVariation;

    const x = centerX + Math.cos(randomAngle) * randomRadius;
    const y = centerY + Math.sin(randomAngle) * randomRadius;
    points.push(new Vector2D(x, y));

    // Add intermediate points for smoother curves with randomness
    if (i < trackFeatures.length - 1) {
      const nextFeature = trackFeatures[i + 1];
      const midAngle = (randomAngle + nextFeature.angle) / 2;
      const midRadius = (randomRadius + nextFeature.radius) / 2;

      // Add random variation to intermediate points too
      const midVariation = (Math.random() - 0.5) * 0.2 * radius;
      const finalMidRadius = midRadius + midVariation;

      const midX = centerX + Math.cos(midAngle) * finalMidRadius;
      const midY = centerY + Math.sin(midAngle) * finalMidRadius;
      points.push(new Vector2D(midX, midY));
    }
  });

  // Connect back to start
  points.push(points[0]);
  return points;
}

function interpolateCatmullRom(points: Vector2D[], resolution = 10) {
  const smooth = [];

  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];

    for (let t = 0; t < 1; t += 1 / resolution) {
      const t2 = t * t;
      const t3 = t2 * t;

      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

      smooth.push({ x, y });
    }
  }

  return smooth;
}

function getOffsetPoints(points: string | any[], offset: number): Vector2D[] {
  const offsetPoints = [];

  for (let i = 0; i < points.length; i++) {
    const p1 = points[(i - 1 + points.length) % points.length];
    const p2 = points[i];
    const p3 = points[(i + 1) % points.length];

    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = p3.x - p2.x;
    const dy2 = p3.y - p2.y;

    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);

    const angle = (angle1 + angle2) / 2;

    const ox = Math.cos(angle + Math.PI / 2) * offset;
    const oy = Math.sin(angle + Math.PI / 2) * offset;

    offsetPoints.push(new Vector2D(p2.x + ox, p2.y + oy));
  }

  return offsetPoints;
}

function generateControlPoints(
  centerX: number,
  centerY: number,
  count: number,
  radius: number,
) {
  const points = [];
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep + Math.random() * angleStep * 0.5;
    const r = radius + Math.random() * 80 - 40;
    points.push(
      new Vector2D(
        centerX + Math.cos(angle) * r,
        centerY + Math.sin(angle) * r,
      ),
    );
  }

  return points;
}

export function generateTrackPointsV2(
  centerX: number,
  centerY: number,
  numPoints = 16,
  radius = 250,
) {
  const rawPoints = generateControlPoints(centerX, centerY, numPoints, radius);
  return interpolateCatmullRom(rawPoints, 8);
}
