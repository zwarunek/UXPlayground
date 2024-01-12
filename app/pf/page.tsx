"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { drawGrid, drawLine, getGridKeys } from "@/app/pf/pfUtils";
import { cn } from "@/lib/utils";

type GridItem = {
  type: "blank" | "wall";
  location: [number, number];
};

export type Settings = {
  rows: number;
  cols: number;
  squareSize: number;
  toolSize: number;
};
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
  const [rows, setRows] = React.useState<number>(0);
  const [cols, setCols] = React.useState<number>(0);
  const [squareSize, setSquareSize] = React.useState<number>(0);
  const mainCanvas = useRef<HTMLCanvasElement>(null);
  const cursorCanvas = useRef<HTMLCanvasElement>(null);
  const gridLineCanvas = useRef<HTMLCanvasElement>(null);
  const traceCanvas = useRef<HTMLCanvasElement>(null);
  const [toolSize, setToolSize] = React.useState(1);
  const [offset, setOffset] = React.useState(0);
  const gridState = useRef<Grid>(new Grid(0, 0, "blank"));
  const tool = useRef<"blank" | "wall" | undefined>(undefined);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [showGrid, setShowGrid] = React.useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number } | undefined>(undefined);
  const settings = useRef<Settings>({
    rows: 0,
    cols: 0,
    squareSize: 0,
    toolSize: 0,
  });
  const [showTrace, setShowTrace] = React.useState<boolean>(false);

  useEffect(() => {
    const shouldShowGrid: boolean = localStorage.getItem("showGrid") === "true";
    const shouldShowTrace: boolean =
      localStorage.getItem("showTrace") === "true";
    const rows = +(localStorage.getItem("rows") || "20");
    const cols = +(localStorage.getItem("cols") || "20");
    const squareSize = +(localStorage.getItem("squareSize") || "30");
    const toolSize = +(localStorage.getItem("toolSize") || "5");
    setShowGrid(shouldShowGrid);
    setShowTrace(shouldShowTrace);
    setRows(rows);
    setCols(cols);
    setSquareSize(squareSize);
    setToolSize(toolSize);
    settings.current = { rows, cols, squareSize, toolSize };
    gridState.current = new Grid(rows, cols, "blank");
    settings.current = { rows, cols, squareSize, toolSize };
  }, []);

  useEffect(() => {
    settings.current = { rows, cols, squareSize, toolSize };
  }, [rows, cols, squareSize, toolSize]);

  useLayoutEffect(() => {
    const ctx = mainCanvas.current?.getContext("2d");
    if (ctx) {
      ctx.translate(0.5, 0.5);
      ctxRef.current = ctx;
    }
    initGrid();
    drawGrid(gridLineCanvas.current, { rows, cols, squareSize });
  }, [rows, cols, squareSize]);

  function drawSquare(gridItem: GridItem, size = squareSize) {
    let [row, col] = gridItem.location;
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    const x = col * squareSize - ((size)/2 - squareSize/2)
    const y = row * squareSize - ((size)/2 - squareSize/2)
    ctx.restore();
    ctx.fillStyle = gridItem.type === "blank" ? "black" : "gray";
    ctx.fillRect(x, y, size, size);
    const circle = new Path2D();
    circle.arc(x + squareSize/2, y + squareSize/2, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(185,91,91)";
    ctx.fill(circle);
    ctx.restore();
    
    ctx.restore();
    if (size < squareSize) {
      requestAnimationFrame(() => drawSquare(gridItem, size + .1));
    }
  }

  function initGrid() {
    gridState.current = new Grid(rows, cols, "blank");
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx.reset();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "black";
    ctx?.fillRect(0, 0, cols * squareSize, rows * squareSize);
    traceCanvas.current?.getContext("2d")?.reset();
  }

  function drawTrace(x: number, y: number) {
    const ctx2 = traceCanvas.current?.getContext("2d");
    if (lastMousePos.current && ctx2 && tool.current) {
      ctx2.lineWidth = 5;
      ctx2.lineCap = "round";
      ctx2.lineJoin = "round";

      drawLine(ctx2, lastMousePos.current.x, lastMousePos.current.y, x, y);
    }
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
            initGrid();
          }}
        >
          Reset
        </Button>
        <Slider
          value={[toolSize]}
          onValueChange={(v) => {
            setToolSize(v[0]);
            localStorage.setItem("toolSize", v[0].toString());
          }}
          min={5}
          max={65}
          step={15}
          className={`w-96`}
        />
        {toolSize}
        <Checkbox
          onCheckedChange={(checked) => {
            if (typeof checked !== "boolean") return;
            setShowGrid(checked);
            localStorage.setItem("showGrid", checked.toString());
          }}
          checked={showGrid}
        />
        <Checkbox
          onCheckedChange={(checked) => {
            if (typeof checked !== "boolean") return;
            setShowTrace(checked);
            localStorage.setItem("showTrace", checked.toString());
          }}
          checked={showTrace}
        />
        <div>
          <input
            className={"w-20"}
            type={"number"}
            value={rows}
            onInput={(e) => {
              setRows(+e.currentTarget.value);
              localStorage.setItem("rows", e.currentTarget.value);
            }}
          />
          <input
            className={"w-20"}
            type={"number"}
            value={cols}
            onInput={(e) => {
              setCols(+e.currentTarget.value);
              localStorage.setItem("cols", e.currentTarget.value);
            }}
          />
          <input
            className={"w-20"}
            type={"number"}
            value={squareSize}
            onInput={(e) => {
              setSquareSize(+e.currentTarget.value);
              localStorage.setItem("squareSize", e.currentTarget.value);
            }}
          />
        </div>
      </div>
      <div
        className={
          "flex h-full w-full flex-col items-center justify-center p-12"
        }
      >
        <div className={` cursor-none border border-white`}>
          <div
            style={{ width: cols * squareSize, height: rows * squareSize }}
            className={" relative"}
            onContextMenu={(e) => e.preventDefault()}
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
              className={cn(
                `pointer-events-none absolute left-0 top-0 z-[9] opacity-50`,
                !showGrid && "hidden",
              )}
            />
            <canvas
              ref={traceCanvas}
              width={cols * squareSize}
              height={rows * squareSize}
              className={cn(
                `pointer-events-none absolute left-0 top-0 z-[8] opacity-50`,
                !showTrace && "hidden",
              )}
            />
            <canvas
              ref={mainCanvas}
              width={cols * squareSize}
              height={rows * squareSize}
              className={`absolute left-0 top-0`}
              onMouseDown={(e) => {
                //remove current text selection
                window.getSelection()?.removeAllRanges();

                const keys = getGridKeys(
                  e,
                  mainCanvas.current,
                  settings.current,
                  lastMousePos.current,
                );
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
                  drawSquare(gridItem);
                });
                if (tool.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
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

                  const keys = getGridKeys(
                    e,
                    mainCanvas.current,
                    settings.current,
                    lastMousePos.current,
                  );
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
                    drawSquare(gridItem);
                  });
                  drawTrace(x, y);
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

                  const keys = getGridKeys(
                    e,
                    mainCanvas.current,
                    settings.current,
                    lastMousePos.current,
                  );
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
                    drawSquare(gridItem);
                  });
                  drawTrace(x, y);
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

                const keys = getGridKeys(
                  e,
                  mainCanvas.current,
                  settings.current,
                  lastMousePos.current,
                );
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
                  drawSquare(gridItem);
                });
                drawTrace(x, y);
                lastMousePos.current = { x, y };
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
