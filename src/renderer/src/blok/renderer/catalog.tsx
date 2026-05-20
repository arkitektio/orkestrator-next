import {basicCatalog} from '@a2ui/react/v0_9';
import {Catalog, createFunctionImplementation} from '@a2ui/web_core/v0_9';
import { z} from "zod";
import { RawInspector } from './bloks/inspector/Inspector';
import {shadcnComposableComponents} from './bloks/primitives/Primitives';
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
const overriddenComponentNames = new Set(
  shadcnComposableComponents.map(component => component.name),
);

export const myCatalog = new Catalog(
  'https://arkitekt.live/catalogs/v1.json',
  [
    ...Array.from(basicCatalog.components.values()).filter(
      component => !overriddenComponentNames.has(component.name),
    ),
    ...shadcnComposableComponents,
    MyProfile,
    RawInspector,
  ],
  [...Array.from(basicCatalog.functions.values()), myCheckFunc],
);
