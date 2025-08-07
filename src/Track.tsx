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
