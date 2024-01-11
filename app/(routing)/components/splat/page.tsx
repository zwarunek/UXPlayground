import {Metadata} from "next";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SplatDemo from "@/app/(routing)/components/splat/SplatDemo";

export const metadata: Metadata = {
  title: "Mitosis | ui-playground",
  description: "Mitosis | ui-playground",
};

export default function SplatDemoPage() {
  return (
    <div className={`flex flex-col w-full`}>
      <h1 className={`text-4xl font-bold`}>Splat</h1>

      <Card className={`w-full`}>
        <CardHeader>
          <CardTitle>Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <SplatDemo />
        </CardContent>
      </Card>
    </div>
  );
}