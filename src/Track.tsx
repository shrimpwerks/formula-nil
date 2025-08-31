import { Vector2D } from "./Vector2D";

export function generateTrackPoints(
  centerX: number,
  centerY: number,
  radius: number,
): Vector2D[] {
  const points: Vector2D[] = [];
  const numPoints = 200; // High resolution for smooth curves

  // Define F1-style track features with random placement
  const numFeatures = 5 + Math.floor(Math.random() * 3); // 4-6 features
  const features: Array<{
    startAngle: number;
    endAngle: number;
    type: "straight" | "hairpin" | "chicane" | "sweep";
    intensity: number;
  }> = [];

  // Randomly place track features around the circuit
  const usedAngles: number[] = [];
  for (let i = 0; i < numFeatures; i++) {
    let angle: number;
    do {
      angle = Math.random() * 2 * Math.PI;
    } while (usedAngles.some((used) => Math.abs(angle - used) < 0.8)); // Minimum separation

    usedAngles.push(angle);

    const types: Array<"straight" | "hairpin" | "chicane" | "sweep"> = [
      "straight",
      "hairpin",
      "chicane",
      "sweep",
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    const baseWidth = type === "straight" ? 0.6 : 0.3;
    const width = baseWidth + Math.random() * 0.3;

    features.push({
      startAngle: angle - width / 2,
      endAngle: angle + width / 2,
      type,
      intensity: 0.5 + Math.random() * 0.5,
    });
  }

  // Generate radius function based on track features
  const radiusFunction = (angle: number): number => {
    let r = radius;

    // Apply each feature's influence
    features.forEach((feature) => {
      const influence = getFeatureInfluence(
        angle,
        feature.startAngle,
        feature.endAngle,
        feature.type,
        feature.intensity,
        radius,
      );
      r += influence;
    });

    // Add subtle background variation
    r += Math.sin(angle * 0.7) * radius * 0.08;
    r += Math.sin(angle * 1.3 + 1) * radius * 0.05;

    return Math.max(r, radius * 0.4);
  };

  function getFeatureInfluence(
    angle: number,
    start: number,
    end: number,
    type: string,
    intensity: number,
    baseRadius: number,
  ): number {
    // Normalize angles
    const normalizedAngle =
      ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let normalizedStart =
      ((start % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let normalizedEnd = ((end % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Handle wrap-around
    if (normalizedEnd < normalizedStart) {
      if (
        normalizedAngle >= normalizedStart ||
        normalizedAngle <= normalizedEnd
      ) {
        // We're in the feature
      } else {
        return 0;
      }
    } else {
      if (
        normalizedAngle < normalizedStart ||
        normalizedAngle > normalizedEnd
      ) {
        return 0;
      }
    }

    // Calculate position within feature (0 to 1)
    let t: number;
    if (normalizedEnd < normalizedStart) {
      // Wrap-around case
      if (normalizedAngle >= normalizedStart) {
        t =
          (normalizedAngle - normalizedStart) /
          (2 * Math.PI - normalizedStart + normalizedEnd);
      } else {
        t =
          (2 * Math.PI - normalizedStart + normalizedAngle) /
          (2 * Math.PI - normalizedStart + normalizedEnd);
      }
    } else {
      t =
        (normalizedAngle - normalizedStart) / (normalizedEnd - normalizedStart);
    }

    // Smooth transition using cosine interpolation
    const smoothT = (1 - Math.cos(t * Math.PI)) / 2;

    switch (type) {
      case "straight":
        return Math.sin(smoothT * Math.PI) * baseRadius * 0.3 * intensity;
      case "hairpin":
        return -Math.sin(smoothT * Math.PI) * baseRadius * 0.4 * intensity;
      case "chicane":
        return Math.sin(smoothT * Math.PI * 3) * baseRadius * 0.2 * intensity;
      case "sweep":
        return (
          Math.sin(smoothT * Math.PI) *
          baseRadius *
          0.25 *
          intensity *
          (t < 0.5 ? 1 : -1)
        );
      default:
        return 0;
    }
  }

  // Generate points using parametric approach
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const angle = t * 2 * Math.PI;

    // Get smooth radius for this angle
    const trackRadius = radiusFunction(angle);

    // Add small amount of noise for track character
    const noise = (Math.random() - 0.5) * radius * 0.02; // Reduced noise
    const finalRadius = trackRadius + noise;

    const x = centerX + Math.cos(angle) * finalRadius;
    const y = centerY + Math.sin(angle) * finalRadius;

    points.push(new Vector2D(x, y));
  }

  // Apply smoothing passes to eliminate sharp corners
  const smoothedPoints: Vector2D[] = [];
  for (let pass = 0; pass < 2; pass++) {
    // Multiple smoothing passes
    const sourcePoints = pass === 0 ? points : smoothedPoints;
    const targetPoints = pass === 0 ? smoothedPoints : points;

    if (pass === 1) points.length = 0; // Clear for second pass

    for (let i = 0; i < numPoints; i++) {
      const prev = sourcePoints[(i - 1 + numPoints) % numPoints];
      const curr = sourcePoints[i];
      const next = sourcePoints[(i + 1) % numPoints];

      // Weighted average smoothing
      const smoothX = curr.x * 0.5 + prev.x * 0.25 + next.x * 0.25;
      const smoothY = curr.y * 0.5 + prev.y * 0.25 + next.y * 0.25;

      if (pass === 0) {
        smoothedPoints.push(new Vector2D(smoothX, smoothY));
      } else {
        points.push(new Vector2D(smoothX, smoothY));
      }
    }
  }

  // Ensure closure
  points.push(points[0]);
  return points;
}
