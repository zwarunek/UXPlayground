import {ReactNode} from "react";

export default function ComponentsLayout({children}: {children: ReactNode}) {
  return (
    <div className={`flex flex-col h-full w-full`}>
      {children}
    </div>
  );
}