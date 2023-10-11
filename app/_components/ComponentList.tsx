import Link from "next/link";
import NavLink from "@/components/NavLink";
import {ScrollArea} from "@/components/ui/scroll-area";

export type component = {
  name: string;
  path: string;
};

const components: component[] = [
  {
    name: "Moving Tabs",
    path: "/components/moving-tabs",
  },
  {
    name: "Apple Unbox Slider",
    path: "/components/apple-unbox-slider",
  },
];

export default function ComponentList() {
  return (
    <div className={`h-full flex px-8 pb-8 max-w-[15rem]`}>
      <div className={`flex flex-col`}>
        <Section title={`Components`} >
          {components.map((c, index) => (
            <NavLink key={index} path={c.path} label={c.name} />
          ))}
        </Section>
      </div>
    </div>
  );
}

const Label = ({ title }: { title: string }) => {
  return (
    <div className={`whitespace-nowrap text-sm text-foreground font-semibold mb-1 py-1`}>{title}</div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className={`flex flex-col pb-8`}>
      <Label title={title} />
      {children}
    </div>
  );
}