import NavLink from "@/components/NavLink";
export default function ComponentList() {
  return (
    <div className={`h-full flex flex-col px-8 pb-8 max-w-[15rem]`}>
          <div className={'whitespace-nowrap text-sm text-foreground font-semibold mb-1 py-1'} >
            Components
          </div>
          <NavLink path={'/components/moving-tabs'} label={'Moving Tabs'} />
          <NavLink path={'/components/apple-unbox-slider'} label={'Apple Unbox Slider'} />
          <NavLink path={'/components/apple-unbox-slider-2'} label={'Apple Unbox Slider 2'} />
          <NavLink path={'/components/mitosis'} label={'Mitosis'} />
    </div>
  );
}