import { Button } from "@/components/ui/button";
import { DemandKind, ListShortcutFragment, PortKind, useShortcutsQuery } from "@/rekuest/api/graphql";
import { LightningBoltIcon } from "@radix-ui/react-icons";

export const ShortcutButton = (
    props: { shortcut: ListShortcutFragment },
  ) => {

  
    return (
      <Button
        onClick={() => {alert("Not implemented")}}
        value={props.shortcut.id}
        key={props.shortcut.id}
        className="flex-initial flex flex-row group cursor-pointer border border-1 rounded rounded-full bg-slate-800 shadow-xl  h-8 overflow-hidden truncate max-w-[400px] ellipsis px-2"
        
      >
        {props.shortcut.allowQuick && <LightningBoltIcon className="w-4 h-4" />}
        <span className="mr-auto text-md text-gray-100 ellipsis truncate w-full">
          {props.shortcut.name}
        </span>
      </Button>
    );
  };
  



export const ShortcutToolbar = (props: {identifier: string, object: string}) => {
  const demands = [
    {
      kind: DemandKind.Args,
      matches: [
        { at: 0, kind: PortKind.Structure, identifier: props.identifier },
      ],
    },
  ];

  

  const { data, error } = useShortcutsQuery({
    variables: {
      filters: {
        demands: demands,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (error)
    return (
      <span className="font-light text-xs w-full items-center ml-2 w-full">
        Error
      </span>
    );

  if (!data) {
    return null;
  }

  if (data.shortcuts.length === 0) {
    return (
      <span className="font-light text-xs w-full items-center ml-2 w-full">
        No nodes...
      </span>
    );
  }

  return (
    <div className="flex flex-row gap-2 p-2">
      {data?.shortcuts.map((x) => <ShortcutButton shortcut={x} {...props} />)}
    </div>
  );
};