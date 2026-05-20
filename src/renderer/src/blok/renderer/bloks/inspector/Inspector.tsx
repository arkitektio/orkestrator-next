import {createBinderlessComponentImplementation} from '@a2ui/react/v0_9';
import zod from "zod";


export const RawInspector = createBinderlessComponentImplementation({
  name: 'RawInspector',
  schema: zod.object({
    name: zod.string(),
  })

}, ({context}) => {
  // Access the raw, unresolved component model and the data model directly
  const rawData = context.componentModel.properties;
  const componentId = context.componentModel.id;

  return (
    <details>
      <summary>Raw Component State (ID: {componentId})</summary>
      <pre>{JSON.stringify(rawData, null, 2)}</pre>
    </details>
  );
});
