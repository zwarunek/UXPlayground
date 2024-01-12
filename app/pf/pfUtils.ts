import React from "react";

export type Point = {
  x: number;
  y: number;
};
export function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  ctx.strokeStyle = "rgb(255,0,0)";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

export function drawGrid(
  canvas: HTMLCanvasElement | null,
  {
    rows,
    cols,
    squareSize,
  }: { rows: number; cols: number; squareSize: number },
) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.reset();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;
  for (let i = 1; i < rows; i++) {
    ctx.rect(0, i * squareSize, cols * squareSize, 1);
    ctx.fill();
  }

  for (let i = 1; i < cols; i++) {
    ctx.rect(i * squareSize, 0, 1, rows * squareSize);
    ctx.fill();
  }
}

export function getGridKeys(
  e: React.MouseEvent,
  canvas: HTMLCanvasElement | null,
  {
    rows,
    cols,
    squareSize,
    toolSize,
  }: { rows: number; cols: number; squareSize: number; toolSize: number },
  lastPos: { x: number; y: number } | undefined,
): [number, number][] | undefined {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const currentLocation: Point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  const keys: [number, number][] = [];

  const lines = lastPos
    ? findOuterLines(currentLocation, lastPos, toolSize)
    : null;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const squareCenter: Point = {
        x: col * squareSize + squareSize / 2,
        y: row * squareSize + squareSize / 2,
      };
      if (
        isPointInCircle(squareCenter, { ...currentLocation, radius: toolSize })
          || (lines && isPointInPolygon(
            squareCenter,
            [(lines.l1.p1), (lines.l1.p2), (lines.l2.p2), (lines.l2.p1)],
        ))
      ) {
        keys.push([row, col]);
      }
    }
  }
  return keys;
}

function isPointInCircle(
  point: Point,
  circle: { radius: number } & Point,
): boolean {
  // Calculate the distance between the point and the circle's center
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

  // Check if the distance is less than or equal to the radius
  return distanceFromCenter <= circle.radius;
}

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) != (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

function findOuterLines(
  point1: { x: number; y: number },
  point2: { x: number; y: number },
  radius: number,
) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < 20) {
    return null;
  }

  // Normalized direction vector
  const unitDx = dx / length;
  const unitDy = dy / length;

  // Calculate the perpendicular vector (normalized)
  const perpDx = unitDy;
  const perpDy = -unitDx;

  // Find two points on each parallel line
  const l1p1 = { x: point1.x + perpDx * radius, y: point1.y + perpDy * radius };
  const l2p1 = { x: point1.x - perpDx * radius, y: point1.y - perpDy * radius };

  const l1p2 = { x: point2.x + perpDx * radius, y: point2.y + perpDy * radius };
  const l2p2 = { x: point2.x - perpDx * radius, y: point2.y - perpDy * radius };

  return { l1: { p1: l1p1, p2: l1p2 }, l2: { p1: l2p1, p2: l2p2 } };
}