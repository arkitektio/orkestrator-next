import {Catalog, createFunctionImplementation} from '@a2ui/web_core/v0_9';
import {z} from 'zod';
import { RawInspector } from './bloks/inspector/Inspector';
import { MyProfile } from './bloks/profile/Profile';

// 1. Implement a custom logic function
const myCheckFunc = createFunctionImplementation(
  {
    name: 'is_admin',
    returnType: 'boolean',
    schema: z.object({role: z.string()}),
  },
  args => args.role === 'admin',
);

// 2. Compose the catalog
export const myCatalog = new Catalog(
  'https://arkitekt.live/catalogs/v1.json',
  [MyProfile, RawInspector], // List of ReactComponentImplementation
  [], // List of FunctionImplementation
);
