import { DisplayWidgetProps } from "@/lib/display/registry";
import { useGetEntityCategoryQuery } from "../api/graphql";

export const EntityCategoryDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetEntityCategoryQuery({
    variables: { id: props.object },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{data?.entityCategory.label}</h1>
      <p className="text-gray-600">
        {data?.entityCategory.description || "No description available."}
      </p>
      {/* Additional components or content can be added here */}
    </div>
  );
};
