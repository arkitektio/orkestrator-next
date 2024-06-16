import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MikroRenderTree } from "@/linkers";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  ContextNodeFragment,
  GridNodeFragment,
  OverlayNodeFragment,
  RenderNodeFragment,
  RenderNodeNestedFragment,
  TreeFragment,
  usePinImageMutation,
  useRenderTreeQuery,
} from "../api/graphql";
import { TwoDRGBRender } from "../components/render/TwoDRGBRender";

export type IRepresentationScreenProps = {};

export const ContextNodeWiget = ({
  object,
}: {
  object: ContextNodeFragment;
}) => {
  return (
    <Card className="flex-1 max-h-[400px]">
      <CardHeader>
        <CardTitle>{object.label}</CardTitle>
      </CardHeader>
      <CardContent className="w-full h-full flex max-h-[300px]">
        <AspectRatio ratio={1}>
          <TwoDRGBRender context={object.context} />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export const GridNodeWidget = ({ object }: { object: GridNodeFragment }) => {
  return (
    <div className="flex grid grid-cols-6 w-full gap-2">
      {" "}
      {object.children?.map((child) => <ChildRenderer object={child} />)}
    </div>
  );
};

export const OverlayNodeWidget = ({
  object,
}: {
  object: OverlayNodeFragment;
}) => {
  return (
    <div className="flex grid">
      {" "}
      {object.children?.map((child) => <ChildRenderer object={child} />)}
    </div>
  );
};

export const ChildRenderer = ({
  object,
}: {
  object: RenderNodeFragment | RenderNodeNestedFragment;
}) => {
  if (object.__typename == "ContextNode")
    return <ContextNodeWiget object={object} />;
  if (object.__typename == "OverlayNode")
    return <OverlayNodeWidget object={object} />;
  if (object.__typename == "GridNode")
    return <GridNodeWidget object={object} />;
  return <>Unknown Child</>;
};

export const TreeRenderer = ({ tree }: { tree: TreeFragment }) => {
  return (
    <div className="w-full h-full flex">
      {tree.children?.map((child) => <ChildRenderer object={child} />)}
    </div>
  );
};

export default asDetailQueryRoute(
  withMikroNext(useRenderTreeQuery),
  ({ data, refetch }) => {
    const [pinImage] = withMikroNext(usePinImageMutation)();

    return (
      <MikroRenderTree.ModelPage
        title={data?.renderTree?.name}
        object={data?.renderTree?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <MikroRenderTree.Komments object={data?.renderTree?.id} />
              ),
            }}
          />
        }
      >
        <TreeRenderer tree={data?.renderTree?.tree} />
      </MikroRenderTree.ModelPage>
    );
  },
);
