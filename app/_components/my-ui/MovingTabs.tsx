"use client";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MovingTabs({
  children,
  value,
  className = "",
  defaultValue,
}: {
  children: ReactNode;
  value?: string;
  className?: string;
  defaultValue?: string;
}) {
  const indicator = useRef<HTMLDivElement | null>(null);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorOffset, setIndicatorOffset] = useState(0);

  useLayoutEffect(() => {
    const element = indicator.current;
    if (indicatorVisible && element && element.parentNode) {
      const onMouseOver = (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        setIndicatorWidth(target.clientWidth);
        setIndicatorOffset(target.offsetLeft);
      };

      const parent = element.parentNode;
      const siblings = Array.from(
        parent.children as unknown as HTMLDivElement[],
      ).filter((child) => child !== element);

      siblings.forEach((sibling) => {
        sibling.addEventListener("mousemove", onMouseOver);
      });
      // Cleanup function to remove event listeners
      return () => {
        siblings.forEach((sibling) => {
          sibling.removeEventListener("mousemove", onMouseOver);
        });
      };
    }
  }, [indicatorVisible]);

  const setIndicatorVisibility = () => {
    if (!indicatorVisible) setIndicatorVisible(true);
  };

  return (
    <Tabs
      className={cn("h-full", className)}
      defaultValue={defaultValue}
      value={value}
    >
      <TabsList
        id={`movingTabs`}
        className={`relative h-full bg-background p-0`}
        onMouseMove={setIndicatorVisibility}
        onMouseLeave={() => setIndicatorVisible(false)}
      >
        <motion.div
          animate={{
            width: indicatorWidth,
            x: indicatorOffset,
            opacity: indicatorVisible ? 0.1 : 0,
          }}
          transition={{
            width: { type: "tween", duration: 0.1 },
            x: { type: "tween", duration: 0.1 },
            opacity: { type: "tween", duration: 0.2 },
          }}
          initial={{
            width: indicatorWidth,
            x: indicatorOffset,
            opacity: 0,
          }}
          exit={{
            opacity: 0,
          }}
          ref={indicator}
          id={`movingIndicator`}
          className={`pointer-events-none absolute bottom-2.5 left-0 top-0 w-40 rounded-lg bg-primary`}
        ></motion.div>
        {children}
      </TabsList>
    </Tabs>
  );
}

export function MovingTabsTrigger({
  children,
  value,
  id,
}: {
  children: ReactNode;
  value: string;
  id?: string;
}) {
  return (
    <TabsTrigger
      id={id}
      className={`data-[state=active]:bg-unset h-full w-full border-b-2 border-transparent p-0 hover:text-primary data-[state=active]:rounded-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none`}
      value={value}
    >
      {children}
    </TabsTrigger>
  );
}
