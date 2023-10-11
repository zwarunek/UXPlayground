import {Metadata} from "next";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import MovingTabsDemo from "@/app/(routing)/components/moving-tabs/MovingTabsDemo";

export const metadata: Metadata = {
  title: "Moving Tabs | ui-playground",
  description: "Moving Tabs | ui-playground",
};

export default function MovingTabsPage() {
  return (
    <div className={`flex flex-col w-full`}>
      <h1 className={`text-4xl font-bold mb-8`}>Moving Tabs</h1>
      
      <Card className={`w-full`}>
        <CardHeader>
          <CardTitle>Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <MovingTabsDemo />
        </CardContent>
      </Card>
    </div>
  );
}