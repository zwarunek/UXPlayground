'use client';

import {useRef, useState} from "react";
import {Slider} from "@/components/ui/slider";
import {Checkbox} from "@/components/ui/checkbox";
import SplatContainer from "@/components/my-ui/Splat/SplatContainer";
import SplatObject from "@/components/my-ui/Splat/SplatObject";
import {HexColorPicker} from "react-colorful";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";

export default function SplatDemo () {
  const constraintsRef = useRef(null)
  const [blurLevel, setBlurLevel] = useState(50)
  const [layerVisible, setLayerVisible] = useState(true)
  const [color, setColor] = useState("#2e602e");
  const [burnColor, setBurnColor] = useState("#690adc");
  
  return (
    <div>
      <div className={`py-8 flex flex-col gap-2`}>
        <Slider
          defaultValue={[blurLevel]}
          max={100}
          min={0}
          onValueChange={(v) => setBlurLevel(v[0])}
          className={"bg-red-800 max-w-xs"}
        />
        <Checkbox
          checked={layerVisible}
          onCheckedChange={(e: boolean) => setLayerVisible(e)}
        />
        <div className={`flex gap-4`}>

          <Popover>
            <PopoverTrigger asChild>
              <Button>Burn Color</Button>
            </PopoverTrigger>
            <PopoverContent>
              <HexColorPicker color={burnColor} onChange={setBurnColor} />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button>Color</Button>
            </PopoverTrigger>
            <PopoverContent>
              <HexColorPicker color={color} onChange={setColor} />
            </PopoverContent>
          </Popover>
        </div>
        
      </div>
      <SplatContainer ref={constraintsRef} filterLayerVisible={layerVisible} burnColor={burnColor} color={color} >
        <SplatObject constraintsRef={constraintsRef} blurPercent={blurLevel/100} bgColor={color} />
        <SplatObject constraintsRef={constraintsRef} blurPercent={blurLevel/100} bgColor={color} />
      </SplatContainer>
    </div>
  );
}