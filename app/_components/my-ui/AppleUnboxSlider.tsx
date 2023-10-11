"use client";

import { motion } from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {ArrowRight} from "lucide-react";

export default function AppleUnboxSlider() {
  const [checked, setChecked] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [maxRight, setMaxRight] = useState(0);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null); // [left, top, right, bottom ]
  const [peelLeft, setPeelLeft] = useState(0);

  useEffect(() => {
    setMaxRight((constraintsRef.current?.offsetWidth || 0) * 2 + 4);
    setContainerRect(constraintsRef.current?.getBoundingClientRect() || null);
  }, []);
  
  useEffect(() => {
    console.log('checked', checked)
    
  }, [checked]);
  
  const firstcomp = offset > (containerRect?.width || 0) - (containerRect?.height || 0)*.45 + 4;
  
  return (
    <div className={`h-40 w-80 flex justify-center items-center p-4`}>
      <div
        className={`relative h-10 rounded-full w-full border-2 border-dashed border-border flex justify-center items-center`}
      >
        <div
          ref={constraintsRef} className={`relative w-full h-full flex justify-center items-center`}>
          <div className={`absolute z-[1] top-0 left-0 w-full h-full flex rounded-full overflow-hidden`}>
            <motion.div
              animate={{
                width: offset + "px",
              }}
              transition={{
                width: { duration: dragging ? 0 : 0.5, ease: "easeOut" },
                
              }}
              className={`absolute top-0 bottom-0 left-0 max-w-[100%] transition-colors duration-500 ${checked ? "bg-[#b2e340]" : "bg-border"}`}
            />
          </div>

          <motion.div
            animate={{
              width: firstcomp ? ((containerRect?.width || 0) - (containerRect?.height || 0)*1.4) : (offset - (containerRect?.height || 0))   + "px",
              right: -offset*2 + (containerRect?.width || 0) + (containerRect?.height || 0) + "px",
              opacity: offset > (containerRect?.width || 0) - (containerRect?.height || 0) ? ((containerRect?.width || 0) - offset)/(containerRect?.height || 0) : 1,
            }}
            transition={
              { duration: dragging ? 0 : 0.5, ease: "easeOut" }
            }
            className={`absolute z-[2] top-0 right-0 bottom-0 flex justify-end rounded items-center`}// bg-gradient-to-r from-border via-primary-foreground via-[12px] to-white to-90% shadow-[1px_1px_8px_2px_rgba(0,0,0,0.05)]
          >
            <div className={`absolute h-full top-0 bottom-0 right-0 left-0 shadow-md shadow-primary`}/>
            <motion.div
              animate={{
                width: offset < (containerRect?.height || 0)+4 ? offset : (containerRect?.height || 0) + 4 + "px",
                right: offset < (containerRect?.height || 0) ? -(containerRect?.height || 0) * .9 - 4 : -(containerRect?.height || 0) * .9 - 4 + "px",
                height: offset*2 < (containerRect?.height || 0) ? offset*2 : (containerRect?.height || 0) + "px",
              }}
              transition={
                { duration: dragging ? 0 : 0.5, ease: "easeOut" }
              }

              className={`absolute h-full shadow-md shadow-primary rounded-r-full`}/>
            <motion.div
              animate={{
                width: firstcomp ? (offset - ((containerRect?.width || 0) - (containerRect?.height || 0)*.5)) : 0 + "px",
                right: 'calc(100% - ' + (containerRect?.height || 0) * .1 + 4 + "px)",
              }}
              transition={
                { duration: dragging ? 0 : 0.5, ease: "easeOut" }
              } className={`absolute h-full  shadow-md shadow-primary rounded-l-full`}/>
          </motion.div>
          <motion.div
            animate={{
              width: offset + "px",
              left: offset + "px",
            }}
            transition={
              { duration: dragging ? 0 : 0.5, ease: "easeOut" }
            }
            className={`absolute z-[3] -top-0.5 right-0 -bottom-0.5 rounded-l-[2px] flex justify-end items-center overflow-hidden`}// bg-gradient-to-r from-border via-primary-foreground via-[12px] to-white to-90% shadow-[1px_1px_8px_2px_rgba(0,0,0,0.05)]
          >
            <div
              style={{width: containerRect?.width || 0}}
              className={`absolute z-[3] right-0 h-full rounded-full overflow-hidden`}>

              <motion.div
                animate={{
                  width: offset + "px",
                  opacity: offset > (containerRect?.width || 0) - (containerRect?.height || 0) ? ((containerRect?.width || 0) - offset)/(containerRect?.height || 0) : 1,
                }}
                transition={
                  { duration: dragging ? 0 : 0.5, ease: "easeOut" }
                }
                className={`absolute right-0 z-[2] h-full bg-gradient-to-r from-border via-background via-[12px] to-border to-90%`}>
              </motion.div>
            </div>
            <div
              style={{width: containerRect?.width || 0}}
              className={`absolute z-[2] right-0 h-full rounded-full overflow-hidden`}>

              <motion.div
                animate={{
                  width: offset + "px",
                }}
                transition={
                  { duration: dragging ? 0 : 0.5, ease: "easeOut" }
                }
                className={`absolute right-0 z-[2] h-full bg-background`}>
              </motion.div>
            </div>
            <div
              className={`absolute z-[3] h-[100%] rounded-full`}
              style={{width: maxRight/2,
                opacity: offset > (containerRect?.width || 0) - (containerRect?.height || 0) ? ((containerRect?.width || 0) - offset)/(containerRect?.height || 0) : 1,
            }}
              
            >
              <div className={`absolute z-[1] right-0 h-full aspect-square rounded-full p-[7px]`}>
                <div className={`rounded-full h-full aspect-square text-[#b2e340] p-1 border border-[#b2e340]`}>
                  <ArrowRight className={`w-full h-full -scale-x-100`} />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className={`absolute z-[3] left-0 rounded-full h-full aspect-square cursor-pointer`}
            ref={thumbRef}
            id={`appleUnboxSliderThumb`}
            drag
            dragElastic={false}
            dragConstraints={{
              left: 0,
              right: maxRight,
            }}
            dragSnapToOrigin={true}
            onDrag={(event, info) => {
              if ((event.target as HTMLDivElement).id !== 'appleUnboxSliderThumb' || !constraintsRef.current || checked) return;
              const rect = constraintsRef.current.getBoundingClientRect();
              const left = rect.left
              const width = rect.width
              const thumb = (event.target as HTMLDivElement).getBoundingClientRect();
              const thumbLeft = (thumb.left || 0)
              // console.log(containerRect, offset)
              setOffset((thumbLeft - left)/2);
              if((thumbLeft - left)/2 >= (containerRect?.width || 0)+1) {
                setChecked(true);
              }
            }}
            onDragStart={(event, info) => {
              setDragging(true);
            }}
            onDragEnd={(event, info) => {
              setDragging(false);
              // if (info.offset.x > 100) {
              //   setChecked(true);
              // } else {
              //   setChecked(false);
              // }
              if (!checked)
                setOffset(0);
              setPeelLeft(0)
            }}
          />
          <div className={`absolute left-0 h-full aspect-square rounded-full p-1.5`}>
            <div className={`rounded-full bg-[#b2e340] h-full aspect-square text-primary-foreground p-1`}>
              <ArrowRight className={`w-full h-full`} />
            </div>
          </div>
          <span className={`text-muted-foreground opacity-50 font-semibold`}>
          Tear open
        </span>
        </div>
      </div>
    </div>
  );
}
