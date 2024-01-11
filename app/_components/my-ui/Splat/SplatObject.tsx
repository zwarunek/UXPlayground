'use client';

import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {Slider} from "@/components/ui/slider";

export default function SplatObject ({constraintsRef, bgColor = '#000000', blurPercent = .5}: {constraintsRef: React.RefObject<HTMLDivElement>, bgColor?: string, blurPercent?: number}) {

  const [size, setSize] = useState(100)
  const [blurLevel, setBlurLevel] = useState(Math.round((size/3) * blurPercent));

  useEffect(() => {
    setBlurLevel(Math.round((size/3) * blurPercent))
  }, [blurPercent, size]);
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          className={cn(`rounded-full`)}
          drag
          dragConstraints={constraintsRef}
          style={{
            filter: `blur(${blurLevel}px)`,
            width: size + "px",
            height: size + "px",
            backgroundColor: bgColor
          }}
        />
      </ContextMenuTrigger>
      <ContextMenuContent
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault();
        }}
      >
        <ContextMenuItem>
          Size
          <Slider
            defaultValue={[size]}
            max={500}
            min={50}
            onValueChange={(v) => {
              const newSize = v[0];
              setSize(newSize);
            }}
            className={"bg-accent w-40 mx-2"}
          />
          {size}px
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}