import { useCallback, useState, useEffect, useRef } from "react";
import { Application, Graphics, Point, Color, Text } from "pixi.js";
import { generateTrackPoints } from "./Track";
import { Car } from "./Car";
import { Race } from "./Race";
import { updateCar } from "./Car";
import { extendSegmentEnd, Vector2D } from "./Vector2D";

export default function Map({
  race,
  cars,
  setCars,
  onTrackGenerated,
}: {
  race: Race;
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  onTrackGenerated: (trackPoints: Vector2D[]) => void;
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
    onTrackGenerated(points);
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
    cars.forEach((car: Car) => {
      // Draw tooltip with car name
      const tooltip = new Text({
        text: car.name,
        style: {
          fontSize: 10,
          fill: 0xffffff,
          fontFamily: 'Arial',
          antialias: true,
        },
        resolution: 2, // Higher resolution for crisp text
      });

      const tooltipPos = extendSegmentEnd(
        new Vector2D(centerX, centerY),
        car.pos,
        50,
      );

      // Position tooltip next to car (offset right and up)
      tooltip.x = tooltipPos.x;
      tooltip.y = tooltipPos.y;

      // Draw car as rectangle aligned to heading
      const carGraphics = new Graphics();

      // Calculate heading from velocity
      const heading =
        car.velocity.length() > 0
          ? Math.atan2(car.velocity.y, car.velocity.x)
          : 0;

      // Car dimensions
      const carLength = 8;
      const carWidth = 4;

      // Calculate rectangle corners relative to car center
      const halfLength = carLength / 2;
      const halfWidth = carWidth / 2;

      // Rotate rectangle points based on heading
      const cos = Math.cos(heading);
      const sin = Math.sin(heading);

      const corners = [
        { x: -halfLength, y: -halfWidth }, // Back left
        { x: halfLength, y: -halfWidth }, // Front left
        { x: halfLength, y: halfWidth }, // Front right
        { x: -halfLength, y: halfWidth }, // Back right
      ].map((corner) => ({
        x: car.pos.x + corner.x * cos - corner.y * sin,
        y: car.pos.y + corner.x * sin + corner.y * cos,
      }));

      // Draw the rectangle with transparency
      carGraphics.poly(corners).fill({ color: car.color });

      app.stage.addChild(tooltip);
      app.stage.addChild(carGraphics);
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
