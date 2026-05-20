import {z} from 'zod';
import {RawInspector} from './bloks/inspector/Inspector';
import {shadcnComposableComponents} from './bloks/primitives/Primitives';
import {MyProfile} from './bloks/profile/Profile';
import {createBlokCatalog, createBlokFunction} from './runtime';

const myCheckFunc = createBlokFunction(
  {
    name: 'is_admin',
    returnType: 'boolean',
    schema: z.object({role: z.string()}),
  },
  args => args.role === 'admin',
);

export const myCatalog = createBlokCatalog(
  'https://arkitekt.live/catalogs/v1.json',
  [
    ...shadcnComposableComponents,
    MyProfile,
    RawInspector,
  ],
  [myCheckFunc],
);
