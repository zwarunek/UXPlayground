import { Button } from "@/components/ui/button";
import VisualizerProvider from "@/app/pathfinderVisualizer/VisualizerProvider";
import Board from "@/app/pathfinderVisualizer/Board";
import Controls from "@/app/pathfinderVisualizer/Controls";

export default async function PathfinderVisualizerPage() {
  return (
    <div
      className={`bg-background w-full h-full flex items-center flex-col p-2 gap-4`}
    >
      <VisualizerProvider w={50} h={50} size={'20px'} points={[{ x: 5, y: 20, index: 0 }, { x: 40, y: 20, index: 1 }]}>
        <div
          className={
            "w-full rounded-lg bg-muted p-4 flex justify-between text-xl items-center"
          }
        >
          Pathfinding Visualizer
          <Controls />
        </div>
        <div className={`flex justify-center items-center w-full h-full`}>
          <Board />
        </div>
      </VisualizerProvider>
    </div>
  );
}
