import { OpticalElementFragment, PortRole } from "@/mikro-next/api/graphql";
import { Handle, Position, useConnection } from "@xyflow/react";

export const Handles = (props: { self: OpticalElementFragment }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 group-hover:z-10">
      {props.self.ports.map((port) => (
        <Handle
          key={port.id}
          className="w-1 h-1 group-hover:bg-blue-500 hover:opacity-50 opacity-0 transition-opacity duration-300"
          position={Position.Top}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            borderRadius: 5,
            left: 0,
            right: 0,
            zIndex: 0,
            transform: "none",
          }}
          id={port.id}
          isConnectable={false}
          type={port.role === PortRole.Input ? "target" : "source"}
        />
      ))}
    </div>
  );
};
