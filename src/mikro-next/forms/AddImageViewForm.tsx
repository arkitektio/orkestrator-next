import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddContinousScanViewForm } from "./AddContinousScanViewForm";
import { AddMaskViewForm } from "./AddMaskViewForm";
import { AddMultiPositionViewForm } from "./AddMultiPositionViewForm";
import { AddRGBViewForm } from "./AddRGBViewForm";
import { AddTransformationViewForm } from "./AddTransformationViewForm";

export const AddImageViewForm = (props: { image: string }) => {
  return (
    <div className="mt-2">
      <Tabs defaultValue="affine" className="relative">
        <TabsList className="mb-2">
          <TabsTrigger value="specimen">Structure</TabsTrigger>
          <TabsTrigger value="affine">Affine</TabsTrigger>
          <TabsTrigger value="rgb">RGB</TabsTrigger>
          <TabsTrigger value="scan">Scan</TabsTrigger>
          <TabsTrigger value="multiposition">Multi position</TabsTrigger>
        </TabsList>

        <TabsContent
          value="affine"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddTransformationViewForm {...props} />
        </TabsContent>
        <TabsContent
          value="structure"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddMaskViewForm {...props} />
        </TabsContent>
        <TabsContent
          value="rgb"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddRGBViewForm {...props} />
        </TabsContent>
        <TabsContent
          value="scan"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddContinousScanViewForm {...props} />
        </TabsContent>
        <TabsContent
          value="multiposition"
          className={"h-full w-full mt-0 rounded rounded-md "}
        >
          <AddMultiPositionViewForm {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
