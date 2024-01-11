'use client';

import { motion } from "framer-motion";
import {useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {Slider} from "@/components/ui/slider";
import {Checkbox} from "@/components/ui/checkbox";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import MitosisContainer from "@/components/my-ui/Mitosis/MitosisContainer";
import MitosisObject from "@/components/my-ui/Mitosis/MitosisObject";

export default function MitosisDemo () {
  const constraintsRef = useRef(null)
  const [blurLevel, setBlurLevel] = useState(50)
  const [layerVisible, setLayerVisible] = useState(true)
  
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

        
      </div>
      <MitosisContainer ref={constraintsRef} filterLayerVisible={layerVisible} >
        <MitosisObject constraintsRef={constraintsRef} blurPercent={blurLevel/100} />
        <MitosisObject constraintsRef={constraintsRef} blurPercent={blurLevel/100} />
      </MitosisContainer>
    </div>
  );
}