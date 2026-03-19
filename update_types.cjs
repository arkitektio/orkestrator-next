const fs = require('fs');
const code = fs.readFileSync('/home/jhnnsrs/Code/standalones/orkestrator-next/src/renderer/src/reaktion/types.tsx', 'utf-8');

const additionalTypes = `
export type ContextualParams = 
  | ({ kind: "drop"; id: string } & DropContextualParams)
  | ({ kind: "click"; id: string } & ClickContextualParams)
  | ({ kind: "edge"; id: string } & EdgeContextualParams)
  | ({ kind: "connect"; id: string } & ConnectContextualParams)
  | ({ kind: "node"; id: string } & NodeContextualParams);
`;

fs.writeFileSync('/home/jhnnsrs/Code/standalones/orkestrator-next/src/renderer/src/reaktion/types.tsx', code + additionalTypes);
