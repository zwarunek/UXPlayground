import {Metadata} from "next";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import MovingTabsDemo from "@/app/(routing)/components/moving-tabs/MovingTabsDemo";
import AppleUnboxSliderDemo from "@/app/(routing)/components/apple-unbox-slider/AppleUnboxSliderDemo";

export const metadata: Metadata = {
  title: "Apple Unbox Slider | ui-playground",
  description: "Apple Unbox Slider | ui-playground",
};

export default function AppleUnboxSliderPage() {
  return (
    <div className={`flex flex-col w-full`}>
      <h1 className={`text-4xl font-bold`}>Apple Unbox Slider</h1>

      <Card className={`w-full`}>
        <CardHeader>
          <CardTitle>Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <AppleUnboxSliderDemo />
        </CardContent>
      </Card>
    </div>
  );
}