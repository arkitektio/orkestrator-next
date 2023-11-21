import { Button } from "@/components/ui/button";
import { View, useView } from "@/providers/view/ViewContext";

export const ControlButton = (props: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <button
      className="text-xs px-2 py-0 m-0 cursor-pointer rounded bg-gray-800 hover:text-gray-300 disabled:text-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 hidden group-hover:block transition-opacity"
      onClick={() => {
        props.onClick();
      }}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export const TwoDViewController = (props: {
  zSize: number;
  tSize: number;
  cSize: number;
}) => {
  const { activeView, setWith } = useView();

  return (
    <>
      <div className="flex flex-row gap-2 text-xs text-black gap-2 bg-gray-300 rounded-l pr-2 ">
        <ControlButton
          onClick={() => {
            setWith({
              zMin: (activeView.zMin || 0) + 1,
              zMax: (activeView.zMin || 0) + 1,
            });
          }}
          disabled={
            activeView.zMin == undefined ||
            activeView.zMin == null ||
            activeView.zMin >= props.zSize - 1
          }
        >
          {" "}
          Z+{" "}
        </ControlButton>
        z: {activeView.zMin}{" "}
        <ControlButton
          onClick={() => {
            setWith({
              zMin: (activeView.zMin || 1) - 1,
              zMax: (activeView.zMin || 1) - 1,
            });
          }}
          disabled={
            activeView.zMin == undefined ||
            activeView.zMin == null ||
            activeView.zMin == 0
          }
        >
          {" "}
          Z-{" "}
        </ControlButton>
        <ControlButton
          onClick={() => {
            setWith({
              tMin: (activeView.tMin || 0) + 1,
              tMax: (activeView.tMin || 0) + 1,
            });
          }}
          disabled={
            activeView.tMin == undefined ||
            activeView.tMin == null ||
            activeView.tMin >= props.tSize - 1
          }
        >
          {" "}
          T+{" "}
        </ControlButton>
        t: {activeView.tMin}{" "}
        <ControlButton
          onClick={() => {
            setWith({
              tMin: (activeView.tMin || 1) - 1,
              tMax: (activeView.tMin || 1) - 1,
            });
          }}
          disabled={
            activeView.tMin == undefined ||
            activeView.tMin == null ||
            activeView.tMin == 0
          }
        >
          {" "}
          T-{" "}
        </ControlButton>
        <ControlButton
          onClick={() => {
            setWith({
              cMin: (activeView.cMin || 0) + 1,
              cMax: (activeView.cMin || 0) + 1,
            });
          }}
          disabled={
            activeView.cMin == undefined ||
            activeView.cMin == null ||
            activeView.cMin >= props.cSize - 1
          }
        >
          {" "}
          C+{" "}
        </ControlButton>
        c: {activeView.cMin}{" "}
        <ControlButton
          onClick={() => {
            setWith({
              cMin: (activeView.cMin || 1) - 1,
              cMax: (activeView.cMin || 1) - 1,
            });
          }}
          disabled={
            activeView.cMin == undefined ||
            activeView.cMin == null ||
            activeView.cMin == 0
          }
        >
          {" "}
          C-{" "}
        </ControlButton>
      </div>
    </>
  );
};
