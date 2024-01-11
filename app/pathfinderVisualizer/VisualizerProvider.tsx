"use client";

import React, {RefObject, useCallback, useEffect, useReducer, useRef, useState} from "react";

export const VisualizerContext = React.createContext<{
  boardState: Board;
  boardStateRef: RefObject<Board>;
  updateTile: (id: keyof Board, type: Tile["type"], index?: number) => void;
  brushSize: 1 | 2 | 3 | 4;
  setBrushSize: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4>>;
  size: {w: number, h: number, size: `${number}px`};
  resetState: () => void;
  pointsRef: RefObject<Record<number, Tile>>;
}>({
  boardState: {},
  boardStateRef: {
    current: null,
  },
  updateTile: () => {},
  brushSize: 1,
  setBrushSize: () => {},
  size: {w: 0, h:0, size: '0px'},
  resetState: () => {},
  pointsRef: {
    current: {}
  }
});

export const useVisualizer = () => React.useContext(VisualizerContext);

export type Board = Record<`${number}-${number}`, Tile>;

type BoardReducerAction = {
  type: "UPDATE_TILE";
  payload: { id: any; updates: Partial<Tile> };
};
const boardReducer = (
  state: { [x: string]: any },
  action: BoardReducerAction,
): Board => {
  switch (action.type) {
    case "UPDATE_TILE":
      const { id, updates } = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          ...updates,
        },
      };
    // You can add more case statements for other actions
    default:
      return state;
  }
};

export default function VisualizerProvider({
  children,
  w,
  h,
  size,
  points,
}: {
  children: React.ReactNode;
  w: number;
  h: number;
  size: `${number}px`
  points: Omit<Extract<Tile, { type: "point" }>, "type" | 'prevType'>[];
}) {
  const [boardState, setBoardState] = useState(
    initBoardState(w, h, points),
  );
  const pointsRef = useRef<Record<number, Tile >>(points.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.index]: {...curr, type: 'point', prevType: 'blank'}
    }
  } , {}));
  const boardStateRef = useRef<Board>(boardState);
  const [brushSize, setBrushSize] = React.useState<1 | 2 | 3 | 4>(1);

  const updateTile = useCallback((id: keyof Board, type: Tile["type"], index?: number) => {
    const prev = boardStateRef.current[id];
    const prevType = { ...prev }.type;
    if (boardStateRef.current) {
      prev.type = type;
      if (prev.type === 'point' && prevType !== 'point' && index !== undefined){
        prev.prevType = prevType;
        prev.index = index || 0
        pointsRef.current[index] = prev
      }
    }
    boardStateRef.current[id] = prev
  }, [boardState, setBoardState]);
  
  const resetState = () => {
    const b = initBoardState(w, h, points);
    setBoardState(b)
    boardStateRef.current = b
    Object.values(b).forEach((tile) => {
      const el = document.getElementById(tile.x + '-' + tile.y)
      if(el) el.dataset.type = tile.type
    })
  }
  
  const visualize = () => {
    
  }

  return (
    <VisualizerContext.Provider value={{ boardState, boardStateRef, updateTile, brushSize, setBrushSize, size: {w, h, size}, resetState, pointsRef, visualize }}>
      {children}
    </VisualizerContext.Provider>
  );
}

type Node = {
  parent: Node;
  children: Node[];
  loc: {x: number, y: number}
}

function d(nodes: Node[])

export type Tile =
  | { type: "blank"; x: number; y: number }
  | { type: "point"; x: number; y: number; index: number; prevType: Exclude<Tile['type'], 'point'> }
  | { type: "wall"; x: number; y: number }
  | { type: "visited"; x: number; y: number };

function initBoardState(
  w: number,
  h: number,
  points: Omit<Extract<Tile, { type: "point" }>, "type" | 'prevType'>[],
): Board {
  let board: Board = {};

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      board[`${i}-${j}`] = { type: "blank", x: i, y: j };
    }
  }

  points.forEach((point) => {
    board[`${point.x}-${point.y}`] = { ...point, type: "point", prevType: 'blank' };
  });
  return board;
}
