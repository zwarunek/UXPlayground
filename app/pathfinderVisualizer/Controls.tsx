'use client'

import {Button} from "@/components/ui/button";
import {useVisualizer} from "@/app/pathfinderVisualizer/VisualizerProvider";
import {Slider} from "@/components/ui/slider";

export default function Controls() {
  
  const {setBrushSize, brushSize, resetState} = useVisualizer();
  
  
  return (
    <div className={`flex gap-4 items-center justify-center`}>
      {brushSize}
      <Slider className={`w-32`} min={1} max={4} defaultValue={[brushSize]} onValueChange={(val) => setBrushSize(val[0] as typeof brushSize)} />
      <Button variant={"default"} onClick={resetState}>Reset</Button>
      <Button variant={"default"}>Visualize</Button>
    </div>
  )
}