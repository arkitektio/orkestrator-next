import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { DemandKind, PortKind, useAllNodesQuery } from "../api/graphql";


export const ApplicableNodes = (props: {
    object: string
    identifier: string
}) => {

    const { data}  = withRekuest(useAllNodesQuery)({
        variables: {
            filters: {
                demands: [{
                    kind: DemandKind.Args,
                    matches: [{
                        at: 0,
                        kind: PortKind.Structure,
                        identifier: props.identifier
                    }]
                }]
            }
        }
    })


    return <>
    {data?.nodes.map(x => <div key={x.id}>{x.name}</div>)}
    
    </>

}


export const ObjectButton = (props: {
  object: string;
  identifier: string
  children: React.ReactNode;
}) => {
  return (
    <>
      <>
        <Popover>
          <PopoverTrigger asChild>{props.children}</PopoverTrigger>
          <PopoverContent className="text-white">
            <ApplicableNodes object={object} identifier={identifier}/>
          </PopoverContent>
        </Popover>
      </>
    </>
  );
};
