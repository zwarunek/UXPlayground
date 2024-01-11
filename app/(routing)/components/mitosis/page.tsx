import {Metadata} from "next";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import AppleUnboxSliderDemo2 from "@/app/(routing)/components/apple-unbox-slider-2/AppleUnboxSliderDemo2";
import MitosisDemo from "@/app/(routing)/components/mitosis/MitosisDemo";

export const metadata: Metadata = {
  title: "Mitosis | ui-playground",
  description: "Mitosis | ui-playground",
};

export default function AppleUnboxSliderPage() {
  return (
    <div className={`flex flex-col w-full`}>
      <h1 className={`text-4xl font-bold`}>Mitosis</h1>

      <Card className={`w-full`}>
        <CardHeader>
          <CardTitle>Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <MitosisDemo />
        </CardContent>
      </Card>
    </div>
  );
}