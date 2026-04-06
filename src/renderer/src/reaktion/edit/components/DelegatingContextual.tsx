import { ContextualParams } from "@/reaktion/types";
import { DropContextual } from "./DropContextual";
import { SubflowDropContextual } from "./SubflowDropContextual";
import { ClickContextual } from "./ClickContextual";
import { EdgeContextual } from "./EdgeContextual";
import { ConnectContextual } from "./ConnectContextual";
import { NodeContextual } from "./NodeContextual";

export const DelegatingContextual = ({ contextual }: { contextual: ContextualParams }) => {

    switch (contextual.kind) {
      case 'drop':
        return <DropContextual  params={contextual} />
      case 'subflowdrop':
        return <SubflowDropContextual params={contextual} />
      case 'click':
        return <ClickContextual params={contextual} />
      case 'edge':
        return <EdgeContextual params={contextual} />
      case 'connect':
        return <ConnectContextual  params={contextual} />
      case 'node':
        return <NodeContextual  params={contextual} />
    }
    return null
}


