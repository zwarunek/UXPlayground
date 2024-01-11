import {Metadata} from "next";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import AppleUnboxSliderDemo2 from "@/app/(routing)/components/apple-unbox-slider-2/AppleUnboxSliderDemo2";

export const metadata: Metadata = {
  title: "Apple Unbox Slider 2 | ui-playground",
  description: "Apple Unbox Slider 2 | ui-playground",
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
          <AppleUnboxSliderDemo2 />
        </CardContent>
      </Card>
    </div>
  );
}