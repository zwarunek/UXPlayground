'use client'

import { motion } from "framer-motion";
import {forwardRef} from "react";

type ContainerProps = {
  children: React.ReactNode,
  filterLayerVisible: boolean
  
}

const MitosisContainer = forwardRef<
  HTMLDivElement,
  ContainerProps
>(function (props, ref) {
  return (

    <motion.div
      ref={ref}
      className={`relative w-[50rem] h-[50rem] flex items-center justify-center overflow-hidden rounded-xl bg-white`}
    >
      {props.children}

      {props.filterLayerVisible && (
        <>

          <div
            className={`absolute top-0 left-0 w-full h-full bg-black z-10 pointer-events-none mix-blend-color-dodge`}
            style={{
              backgroundColor: '#333333'
            }}
          />
          <div
            className={`absolute top-0 left-0 w-full h-full bg-black z-10 pointer-events-none mix-blend-color-burn`}
            style={{
              backgroundColor: '#000000'
            }}
          />
        </>
      )}
    </motion.div>
  )
})

export default MitosisContainer;