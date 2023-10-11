import { MovingTabs, MovingTabsTrigger } from "@/components/my-ui/MovingTabs";

const items: string[] = ["Dashboard", "Organizations", "Account", "Settings", "Help", "Logout"];
export default function MovingTabsDemo() {
  
  return (
    <MovingTabs defaultValue={items[0].toLowerCase()} className={`h-10`}>
      {items.map((item, index) => (
        <MovingTabsTrigger
          id={item.toLowerCase()}
          value={item.toLowerCase()}
          key={index}
        >
          <div
            key={index}
            className={`flex h-full w-full items-center justify-between px-2 pb-2`}
            draggable={false}
          >
            {item}
          </div>
        </MovingTabsTrigger>
      ))}
    </MovingTabs>
  );
  
}