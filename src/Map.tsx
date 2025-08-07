import { useCallback, useState, useEffect, useRef } from "react";
import { Application, Graphics, Point, Color, Text } from "pixi.js";
import { generateTrackPoints } from "./Track";
import { Car } from "./Car";
import { Race } from "./Race";
import { Vector2D, updateCar } from "./Car";

function extendSegmentEnd(
  p1: Vector2D,
  p2: Vector2D,
  extension: number,
): Vector2D {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  const newX2 = p2.x + (dx / length) * extension;
  const newY2 = p2.y + (dy / length) * extension;

  return { x: newX2, y: newY2 };
}

export default function Map({
  race,
  cars,
  setCars,
  onTrackGenerated,
}: {
  race: Race;
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  onTrackGenerated: (trackPoints: { x: number; y: number }[]) => void;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [trackPoints, setTrackPoints] = useState<Vector2D[]>([]);
  const pixiAppRef = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track dimensions - keeping original size for generation (constants)
  const trackWidth = 600;
  const trackHeight = 400;
  const centerX = trackWidth / 2;
  const centerY = trackHeight / 2;
  const radius = Math.min(trackWidth, trackHeight) / 3;

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

  // Initialize track and cars - run only once
  useEffect(() => {
    const points = generateTrackPoints(centerX, centerY, radius);
    setTrackPoints(points);
    // Convert Point objects to simple {x, y} objects and initialize cars
    const simplePoints = points.map((p) => ({ x: p.x, y: p.y }));
    onTrackGenerated(simplePoints);
  }, []); // Empty dependency array - run only once

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

      const tooltipPos = extendSegmentEnd(
        { x: centerX, y: centerY },
        car.pos,
        50,
      );

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

  useEffect(() => {
    if (trackPoints.length === 0 || !pixiAppRef.current) return;

    const interval = setInterval(() => {
      setCars((prevCars) =>
        prevCars.map((car) => {
          return updateCar(trackPoints, car);
        }),
      );
    }, 16);

    return () => clearInterval(interval);
  }, [trackPoints]);

  // Render when cars or track changes
  useEffect(() => {
    render();
  }, [render]);

  return <div ref={containerRef} />;
}
