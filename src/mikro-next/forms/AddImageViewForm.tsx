import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTransformationViewForm } from "./AddTransformationViewForm";
import { AddRGBViewForm } from "./AddRGBViewForm";

export const AddImageViewForm = (props: { image: string }) => {
  return (
    <div className="mt-2">
      <Tabs defaultValue="affine" className="relative">
        <TabsList className="mb-2">
          <TabsTrigger value="affine">Affine</TabsTrigger>
          <TabsTrigger value="rgb">RGB</TabsTrigger>
        </TabsList>

        <TabsContent
          value="affine"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddTransformationViewForm {...props} />
        </TabsContent>
        <TabsContent
          value="rgb"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddRGBViewForm {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
