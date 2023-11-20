import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTransformationViewForm } from "./AddTransformationViewForm";
import { AddRGBViewForm } from "./AddRGBViewForm";
import { AddLabelViewForm } from "./AddLabelViewForm";
import { useView } from "@/providers/view/ViewContext";
import { AddContinousScanViewForm } from "./AddContinousScanViewForm";

export const AddImageViewForm = (props: { image: string }) => {
  return (
    <div className="mt-2">
      <Tabs defaultValue="affine" className="relative">
        <TabsList className="mb-2">
          <TabsTrigger value="affine">Affine</TabsTrigger>
          <TabsTrigger value="rgb">RGB</TabsTrigger>
          <TabsTrigger value="label">Label</TabsTrigger>
          <TabsTrigger value="scan">Scan</TabsTrigger>
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
        <TabsContent
          value="label"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddLabelViewForm {...props} />
        </TabsContent>
        <TabsContent
          value="scan"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddContinousScanViewForm {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
