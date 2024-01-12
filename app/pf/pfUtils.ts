import React from "react";

export type Point = {
  x: number;
  y: number;
};

export function isWithinPillShape(
  start: Point,
  end: Point,
  radius: number,
  squareTopLeft: Point,
  squareSize: number,
): boolean {
  // Check for each point along the line segment from start to end
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const circleCenter: Point = {
      x: start.x + t * deltaX,
      y: start.y + t * deltaY,
    };

    if (isCircleInSquare(circleCenter, radius, squareTopLeft, squareSize)) {
      return true;
    }
  }

  return false;
}

export function isCircleInSquare(
  circleCenter: Point,
  radius: number,
  squareTopLeft: Point,
  squareSize: number,
): boolean {
  // Find the closest point to the circle within the square
  let closestPoint: Point = {
    x: Math.max(
      squareTopLeft.x,
      Math.min(circleCenter.x, squareTopLeft.x + squareSize),
    ),
    y: Math.max(
      squareTopLeft.y,
      Math.min(circleCenter.y, squareTopLeft.y + squareSize),
    ),
  };

  // Calculate the distance from the closest point to the circle's center
  let distanceX = circleCenter.x - closestPoint.x;
  let distanceY = circleCenter.y - closestPoint.y;
  let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  // Check if the circle is inside or touching the square
  return distance <= radius;
}
export function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.strokeStyle = "rgb(255,0,0)";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

export function drawGrid(canvas: HTMLCanvasElement | null, {rows, cols, squareSize}: {rows: number, cols: number, squareSize: number}) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.reset();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;
  for (let i = 1; i < rows; i++) {
    ctx.rect(0, i * squareSize, cols * squareSize, 1);
    ctx.fill()
  }

  for (let i = 1; i < cols; i++) {
    ctx.rect(i * squareSize, 0, 1, rows * squareSize);
    ctx.fill()
  }
}

export function getGridKeys(e: React.MouseEvent, canvas: HTMLCanvasElement | null, {rows, cols, squareSize, toolSize}: {rows: number, cols: number, squareSize: number, toolSize: number}, lastPos: {x: number, y: number} | undefined): [number, number][] | undefined {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const currentLocation = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  const keys: [number, number][] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const squareTopLeft: Point = {
        x: col * squareSize,
        y: row * squareSize,
      };
      if (
        isWithinPillShape(
          lastPos || currentLocation,
          currentLocation,
          toolSize,
          squareTopLeft,
          squareSize,
        )
      ) {
        keys.push([row, col]);
      }
    }
  }
  return keys;
}