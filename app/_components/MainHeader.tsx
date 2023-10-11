import {ModeToggle} from "@/components/ModeToggle";

export default function MainHeader() {

  return (
    <div
      className={`flex h-10 w-full items-center justify-between gap-8 px-4 py-3 sm:h-16 bg-background border-b border-border`}
    >
      <div className={`flex h-full flex-row gap-8`}>
      </div>
      <div className={`flex h-full items-center gap-4`}>
        <ModeToggle />
      </div>
    </div>
  );
}