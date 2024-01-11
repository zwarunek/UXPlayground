"use client";

import React, { useCallback } from "react";
import {
  Tile,
  Board,
  useVisualizer,
} from "@/app/pathfinderVisualizer/VisualizerProvider";

export default function Board() {
  const { boardState, boardStateRef, updateTile, brushSize, size, pointsRef } = useVisualizer();
  const draggingWall = React.useRef(false);
  const draggingBlank = React.useRef(false);
  const draggingPoint = React.useRef<number | null>(null);
  type BoardKey = keyof Board;
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${size.w}, ${size.size})`, // Adjust cell size as needed
  };
  const cellStyle = {
    width: size.size,
    height: size.size,
  };
  function setTile(id: BoardKey, type: Tile["type"], el?: HTMLElement, index?: number) {
    console.log(id, type)
    if (boardStateRef.current && boardStateRef.current[id]?.type !== type) {
      if (!el) el = document.getElementById(id) || undefined;
      if (el) {
        el.dataset.type = type;
      }
      updateTile(id, type, index);
    }
  }

  const getCirclePoints = (x: number, y: number, brushSize: number) => {
    const points = [];
    for (let dx = -brushSize; dx <= brushSize; dx++) {
      for (let dy = -brushSize; dy <= brushSize; dy++) {
        if (dx * dx + dy * dy <= brushSize * brushSize) {
          points.push({ x: x + dx, y: y + dy });
        }
      }
    }
    return points;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = e.target as HTMLElement;
    const id = el.id as BoardKey;
    const tile = boardStateRef.current?.[id]
    if(!tile) return
    if (draggingBlank.current) {

      const [x, y] = id.split("-").map((n) => parseInt(n));
      const points = getCirclePoints(x, y, brushSize - 1);
      points.forEach((point) => {
        const id = `${point.x}-${point.y}` as BoardKey;
        if (boardStateRef.current?.[id]?.type !== "wall") return;
        setTile(id, "blank");
      });
    }
    if (draggingWall.current ) {
      const [x, y] = id.split("-").map((n) => parseInt(n));
      const points = getCirclePoints(x, y, brushSize - 1);
      points.forEach((point) => {
        const id = `${point.x}-${point.y}` as BoardKey;
        if (boardStateRef.current?.[id]?.type !== "blank" && boardStateRef.current?.[id]?.type !== "visited") return;
        setTile(id, "wall");
      });
    }
    if (draggingPoint.current !== null && pointsRef.current && tile.type !== "point") {
      const point = pointsRef.current[draggingPoint.current] as Extract<Tile, {type: 'point'}>;
      const oldId = `${point.x}-${point.y}` as BoardKey;
      console.log({old: point, new: tile})
      setTile(oldId, point.prevType);
      setTile(id, "point", undefined, point.index);
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = e.target as HTMLElement;
    const id = el.id as BoardKey;
    const tile = boardStateRef.current?.[id]
    const mouseButton = e.buttons;
    if(!tile) return
    if (tile.type === "point") {
      draggingPoint.current = tile.index;
    }
    else if (mouseButton === 2) {
      draggingBlank.current = true;
    }
    else if (mouseButton === 1) {
      draggingWall.current = true;
    }
    onMouseMove(e)
    console.log(true, e);
  }
  
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    draggingBlank.current = false;
    draggingWall.current = false;
    draggingPoint.current = null;
    console.log(false, e);
  }
  
  return (
    <div
      className={"select-none"}
      draggable={false}
      style={gridStyle}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={(e) => {
        const noButtons = e.buttons !== 1 && e.buttons != 2;
        if ((draggingBlank.current || draggingWall.current || draggingPoint.current !== null) && noButtons) {
          onMouseUp(e)
          return
        }
        onMouseMove(e)
      }}
      onMouseMove={onMouseMove}
    >
      {Object.values(boardState).map((tile) => {
        const key = `${tile.x}-${tile.y}` as BoardKey;
        return <Square key={key} id={key} type={tile.type} style={cellStyle} />;
      })}
    </div>
  );
}
const Square = 
  ({ id, type, style }: { id: string; type: Tile["type"], style: React.CSSProperties }) => {
    return (
      <div
        id={id}
        data-type={type}
        className={`border select-none 
            data-[type=wall]:bg-cyan-700 
            data-[type=visited]:bg-purple-500
            data-[type=point]:bg-orange-500
            data-[type=blank]:bg-foreground`}
        style={style}
      >
      </div>
    );
  }

