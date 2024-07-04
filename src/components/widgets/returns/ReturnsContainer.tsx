import { Port } from "@/port-next/api/graphql";
import { ReturnContainerProps } from "@/rekuest/widgets/tailwind";
import { PortGroup } from "@/rekuest/widgets/types";

export type FilledGroup = PortGroup & {
  ports: Port[];
};

export const ReturnsContainer = ({
  ports,
  values,
  options,
  registry,
}: ReturnContainerProps) => {
  let len = ports.length;

  let lg_size = len < 2 ? len : 2;
  let xl_size = len < 3 ? len : 3;
  let xxl_size = len < 4 ? len : 4;
  let xxxl_size = len < 5 ? len : 5;
  let xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-5`}
    >
      {ports.map((port, index) => {
        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <>
            <Widget
              key={index}
              value={values[port.key]}
              port={port}
              widget={port.returnWidget}
              options={options}
            />
          </>
        );
      })}
    </div>
  );
};
