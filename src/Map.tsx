import { useCallback, useState, useEffect, useRef } from "react";
import { Application, Graphics, Point, Color, Text } from "pixi.js";
import { generateTrackPoints, generateTrackPointsV2 } from "./Track";
import { Car } from "./Car";
import { Race } from "./Race";
import { Vector2D, updateCar, estimateTrackLength } from "./Car";

export default function Map({
  race,
  cars,
  setCars,
}: {
  race: Race;
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Track dimensions - keeping original size for generation
  const trackWidth = 600;
  const trackHeight = 400;
  const centerX = trackWidth / 2;
  const centerY = trackHeight / 2;
  const radius = Math.min(trackWidth, trackHeight) / 3;

  const [trackPoints, setTrackPoints] = useState<Vector2D[]>([]);
  const pixiAppRef = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate track points once
  const generateTrack = useCallback(() => {
    return generateTrackPoints(centerX, centerY, radius);
  }, [centerX, centerY, radius]);

  // Calculate responsive canvas size and track positioning
  const updateCanvasSize = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth - 40; // Account for padding
    const containerHeight = window.innerHeight - 200; // Leave space for header

    const aspectRatio = trackWidth / trackHeight;
    let width = containerWidth;
    let height = containerWidth / aspectRatio;

    // If height is too tall, scale by height instead
    if (height > containerHeight) {
      height = containerHeight;
      width = containerHeight * aspectRatio;
    }

    const newScale = Math.min(width / trackWidth, height / trackHeight);
    const newOffset = {
      x: (width - trackWidth * newScale) / 2,
      y: (height - trackHeight * newScale) / 2,
    };

    setScale(newScale);
    setOffset(newOffset);

    // Resize PIXI app if it exists and is initialized
    if (pixiAppRef.current && pixiAppRef.current.renderer) {
      pixiAppRef.current.renderer.resize(width, height);
    }
  }, []);

  // Initialize PIXI Application - only once
  useEffect(() => {
    if (!containerRef.current || pixiAppRef.current) return;

    const app = new Application();
    pixiAppRef.current = app;
    let isInitialized = false;

    (async () => {
      await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1e1e1e,
      });

      isInitialized = true;
      // Clear container first to prevent duplicates
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(app.canvas);
      }

      // Initial size calculation after canvas is added
      setTimeout(updateCanvasSize, 0);
    })();

    return () => {
      if (isInitialized && pixiAppRef.current) {
        pixiAppRef.current.destroy();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      pixiAppRef.current = null;
    };
  }, []); // Only run once

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    updateCanvasSize(); // Initial call

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateCanvasSize]);

  // Initialize track and cars
  useEffect(() => {
    const points = generateTrack();
    setTrackPoints(points);
  }, [generateTrack]);

  // Render function with scaling and centering
  const render = useCallback(() => {
    const app = pixiAppRef.current;
    if (!app || trackPoints.length === 0) return;

    app.stage.removeChildren();

    // Apply scaling and centering transform
    app.stage.scale.set(scale);
    app.stage.position.set(offset.x, offset.y);

    // Draw track
    const trackGraphics = new Graphics();
    trackGraphics.setStrokeStyle({ width: 1, color: new Color("white") });
    trackGraphics.moveTo(trackPoints[0].x, trackPoints[0].y);
    for (let p of trackPoints) {
      trackGraphics.lineTo(p.x, p.y);
    }
    trackGraphics.stroke();
    app.stage.addChild(trackGraphics);

    // Draw cars with tooltips
    cars.forEach((car) => {
      // Draw tooltip with car name
      const tooltip = new Text({
        text: car.name,
        style: {
          fontSize: 10,
          fill: 0xffffff,
        },
      });

      const tooltipPos = drawLine({ x: centerX, y: centerY }, car.pos, 50);

      // Position tooltip next to car (offset right and up)
      tooltip.x = tooltipPos.x;
      tooltip.y = tooltipPos.y;

      // Draw car
      if (car.laps < race.laps) {
        const carGraphics = new Graphics();
        carGraphics.circle(car.pos.x, car.pos.y, 6).fill(car.color);

        app.stage.addChild(tooltip);
        app.stage.addChild(carGraphics);
      }
    });
  }, [trackPoints, cars, scale, offset]);

  function drawLine(p1: Vector2D, p2: Vector2D, extension: number): Vector2D {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    const newX2 = p2.x + (dx / length) * extension;
    const newY2 = p2.y + (dy / length) * extension;

    return { x: newX2, y: newY2 };
  }

  useEffect(() => {
    if (trackPoints.length === 0 || !pixiAppRef.current) return;

    const trackLength = estimateTrackLength(trackPoints); // compute once per effect

    const interval = setInterval(() => {
      setCars((prevCars) =>
        prevCars.map((car) => {
          return updateCar(trackPoints, car);
        }),
      );
    }, 16);

    return () => clearInterval(interval);
  }, [trackPoints, interpolate]);

  // Render when cars or track changes
  useEffect(() => {
    render();
  }, [render]);

  return <div ref={containerRef} />;
}

export function interpolate(points: Vector2D[], t: number): Vector2D {
  const n = points.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return points[0];

  // Clamp t to [0, 1]
  t = Math.max(0, Math.min(1, t));

  // There are (n-1) segments in an open track
  const scaled = t * (n - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;

  const p1 = points[i];
  const p2 = points[i + 1] ?? points[i]; // use p1 at the very end

  return {
    x: p1.x + (p2.x - p1.x) * frac,
    y: p1.y + (p2.y - p1.y) * frac,
  };
}
