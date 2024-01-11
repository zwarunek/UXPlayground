"use client";

import React, {useEffect, useLayoutEffect, useRef} from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {drawGrid, drawLine, getGridKeys, isWithinPillShape, Point, removeGrid} from "@/app/pf/pfUtils";

type GridItem = {
  type: "blank" | "wall";
  location: [number, number];
};
let squareSize = 15;
let cols = 100;
let rows = 75;

export type Settings = {rows: number, cols: number, squareSize: number, toolSize: number};
class Grid {
  private grid: GridItem[][];
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number, defaultType: GridItem["type"]) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    for (let i = 0; i < rows; i++) {
      this.grid.push([]);
      for (let j = 0; j < cols; j++) {
        this.grid[i].push({
          type: defaultType,
          location: [i, j] as [number, number],
        });
      }
    }
  }

  private index(row: number, col: number): number {
    return row * this.cols + col;
  }

  public setItem(row: number, col: number, value: GridItem): void {
    if (row < this.rows && col < this.cols) {
      this.grid[row][col] = value;
    }
  }

  public setType([row, col]: [number, number], type: GridItem["type"]): void {
    if (row < this.rows && col < this.cols) {
      this.grid[row][col].type = type;
    }
  }

  // public getItem(row: number, col: number): GridItem | undefined {
  //   return row < this.rows && col < this.cols ? this.grid[row][col] : undefined;
  // }
  public getItem([row, col]: [number, number]): GridItem | undefined {
    return row < this.rows && col < this.cols ? this.grid[row][col] : undefined;
  }

  public asList(): GridItem[] {
    return this.grid.flat();
  }

  // public getItemFromList(index: number): GridItem | undefined {
  //   const row = Math.floor(index / this.cols);
  //   const col = index % this.cols;
  //   return this.getItem(row, col);
  // }
}

export default function PFPage() {
  const mainCanvas = useRef<HTMLCanvasElement>(null);
  const cursorCanvas = useRef<HTMLCanvasElement>(null);
  const gridLineCanvas = useRef<HTMLCanvasElement>(null);
  const [toolSize, setToolSize] = React.useState(5);
  const [offset, setOffset] = React.useState(0);
  const gridState = useRef(new Grid(rows, cols, "blank"));
  const tool = useRef<"blank" | "wall" | undefined>(undefined);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [showGrid, setShowGrid] = React.useState<boolean>(true);
  const lastMousePos = useRef<{x: number, y: number} | undefined>(undefined);
  const settings = useRef<Settings>({rows, cols, squareSize, toolSize});

  useEffect(() => {
    settings.current = {rows, cols, squareSize, toolSize};
  }, [toolSize]);
  
  useLayoutEffect(() => {
    const shouldShowGrid: boolean = localStorage.getItem("showGrid") === "true";
    setShowGrid(shouldShowGrid);
    const ctx = mainCanvas.current?.getContext("2d");
    if (ctx) {
      ctx.translate(0.5, 0.5);
      ctxRef.current = ctx;
    }
    initGrid(shouldShowGrid);
  }, []);

  function drawSquare({ gridItem }: { gridItem: GridItem }) {
    let [row, col] = gridItem.location;
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    col *= squareSize;
    row *= squareSize;
    ctx.restore();
    ctx.fillStyle = gridItem.type === "blank" ? "black" : "blue";
    ctx.fillRect(col, row, squareSize, squareSize);
    ctx.restore();
  }

  function initGrid(showGrid: boolean) {
    gridState.current = new Grid(rows, cols, "blank");

    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx?.reset();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "black";
    ctx?.fillRect(0, 0, cols * squareSize, rows * squareSize);
    if (showGrid) drawGrid(gridLineCanvas.current, settings.current);
  }

  
  return (
    <div
      className={`flex h-full w-full flex-col items-start justify-center p-2`}
    >
      <div
        className={`flex w-full items-center justify-center gap-4 rounded bg-zinc-900 p-4`}
      >
        <Button
          onClick={() => {
            initGrid(showGrid);
          }}
        >
          Reset
        </Button>
        <Slider
          value={[toolSize]}
          onValueChange={(v) => setToolSize(v[0])}
          min={1}
          max={60}
          step={15}
          className={`w-96`}
        />
        {toolSize}
        <Checkbox
          onCheckedChange={(checked) => {
            if (typeof checked !== "boolean") return;
            setShowGrid(checked);
            localStorage.setItem("showGrid", checked.toString());
            checked ? drawGrid(gridLineCanvas.current, settings.current) : removeGrid(gridLineCanvas.current);
          }}
          checked={showGrid}
        />
      </div>
      <div
        className={
          "flex h-full w-full flex-col items-center justify-center p-12"
        }
      >
        <div className={` border border-white cursor-none`}>
          <div
            style={{ width: cols * squareSize, height: rows * squareSize }}
            className={" relative"}
          >
            <canvas
              ref={cursorCanvas}
              width={cols * squareSize}
              height={rows * squareSize}
              className={`pointer-events-none absolute left-0 top-0 z-10`}
            />
            <canvas
              ref={gridLineCanvas}
              width={cols * squareSize}
              height={rows * squareSize}
              className={`pointer-events-none absolute left-0 top-0 z-[9]`}
            />
            <canvas
              ref={mainCanvas}
              width={cols * squareSize}
              height={rows * squareSize}
              className={`absolute left-0 top-0`}
              onMouseDown={(e) => {
                //remove current text selection
                window.getSelection()?.removeAllRanges();

                const keys = getGridKeys(e, mainCanvas.current, settings.current, lastMousePos.current);
                if (!keys) return;
                const key = keys[0];
                const type = gridState.current.getItem(key)?.type;
                const changedItems: GridItem[] = [];
                keys.forEach((key) => {
                  const item = gridState.current.getItem(key);
                  if (item !== undefined) {
                    if (item.type === "wall" && type === "wall") {
                      gridState.current.setType(key, "blank");
                      tool.current = "blank";
                      changedItems.push(item);
                    } else if (item.type === "blank" && type === "blank") {
                      gridState.current.setType(key, "wall");
                      tool.current = "wall";
                      changedItems.push(item);
                    }
                  }
                });
                changedItems.forEach((gridItem) => {
                  drawSquare({ gridItem });
                });
                if (tool.current) {
                  const canvas = cursorCanvas.current;
                  if (!canvas) return;
                  const rect = canvas.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  lastMousePos.current = { x, y };
                }
              }}
              onMouseUp={(e) => {
                tool.current = undefined;
                lastMousePos.current = undefined;
              }}
              onMouseLeave={(e) => {
                if (tool.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const keys = getGridKeys(e, mainCanvas.current, settings.current, lastMousePos.current);
                  if (!keys) return;
                  const changedItems: GridItem[] = [];
                  keys.forEach((key) => {
                    const item = gridState.current.getItem(key);
                    if (item !== undefined) {
                      if (
                        tool.current === "blank" &&
                        tool.current !== item.type
                      ) {
                        gridState.current.setType(key, "blank");
                        changedItems.push(item);
                      } else if (
                        tool.current === "wall" &&
                        tool.current !== item.type
                      ) {
                        gridState.current.setType(key, "wall");
                        changedItems.push(item);
                      }
                    }
                  });
                  changedItems.forEach((gridItem) => {
                    drawSquare({ gridItem });
                  });
                  const ctx2 = mainCanvas.current?.getContext("2d");
                  if (lastMousePos.current && ctx2 && tool.current)
                    drawLine(ctx2, lastMousePos.current.x, lastMousePos.current.y, x, y);
                  lastMousePos.current = { x, y };
                }
                lastMousePos.current = undefined;
                const canvas = cursorCanvas.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.reset();
              }}
              onMouseEnter={(e) => {
                if (tool.current && e.buttons === 1) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const keys = getGridKeys(e, mainCanvas.current, settings.current, lastMousePos.current);
                  if (!keys) return;
                  const changedItems: GridItem[] = [];
                  keys.forEach((key) => {
                    const item = gridState.current.getItem(key);
                    if (item !== undefined) {
                      if (
                        tool.current === "blank" &&
                        tool.current !== item.type
                      ) {
                        gridState.current.setType(key, "blank");
                        changedItems.push(item);
                      } else if (
                        tool.current === "wall" &&
                        tool.current !== item.type
                      ) {
                        gridState.current.setType(key, "wall");
                        changedItems.push(item);
                      }
                    }
                  });
                  changedItems.forEach((gridItem) => {
                    drawSquare({ gridItem });
                  });
                  const ctx2 = mainCanvas.current?.getContext("2d");
                  if (lastMousePos.current && ctx2 && tool.current)
                    drawLine(ctx2, lastMousePos.current.x, lastMousePos.current.y, x, y);
                  lastMousePos.current = { x, y };
                } else {
                  lastMousePos.current = undefined;
                  tool.current = undefined;
                }
              }}
              onMouseMove={(e) => {
                const canvas = cursorCanvas.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.reset();
                ctx.imageSmoothingEnabled = false;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const circle = new Path2D();
                circle.arc(x, y, toolSize, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(0,255,249,0.2)";
                ctx.fill(circle);
                ctx.restore();

                if (e.buttons !== 1 && tool.current) return;

                const keys = getGridKeys(e, mainCanvas.current, settings.current, lastMousePos.current);
                if (!keys) return;
                const changedItems: GridItem[] = [];
                keys.forEach((key) => {
                  const item = gridState.current.getItem(key);
                  if (item !== undefined) {
                    if (
                      tool.current === "blank" &&
                      tool.current !== item.type
                    ) {
                      gridState.current.setType(key, "blank");
                      changedItems.push(item);
                    } else if (
                      tool.current === "wall" &&
                      tool.current !== item.type
                    ) {
                      gridState.current.setType(key, "wall");
                      changedItems.push(item);
                    }
                  }
                });
                changedItems.forEach((gridItem) => {
                  drawSquare({ gridItem });
                });
                const ctx2 = mainCanvas.current?.getContext("2d");
                if (lastMousePos.current && ctx2 && tool.current)
                  drawLine(ctx2, lastMousePos.current.x, lastMousePos.current.y, x, y);
                lastMousePos.current = { x, y };
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
