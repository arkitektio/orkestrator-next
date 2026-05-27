import {createBlokComponent} from '../../runtime';
import * as zod from 'zod';

export const RawInspector = createBlokComponent({
  name: 'RawInspector',
  schema: zod.object({
    name: zod.string(),
  }),

}, ({component}) => {
  return (
    <details>
      <summary>Raw Component State (ID: {component.id})</summary>
      <pre>{JSON.stringify(component.props ?? [], null, 2)}</pre>
    </details>
  );
});
