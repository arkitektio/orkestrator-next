import {z} from 'zod';
import {toast} from 'sonner';
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

const multiplyFunction = createBlokFunction(
  {
    name: 'math.multiply',
    returnType: 'number',
    schema: z.record(z.string(), z.unknown()),
  },
  args => {
    const factors = Object.entries(args)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey, undefined, {numeric: true}))
      .map(([, value]) => Number(value));

    return factors.reduce((product, factor) => product * factor, 1);
  },
);

const loggerInfoFunction = createBlokFunction(
  {
    name: 'logger.info',
    schema: z.record(z.string(), z.unknown()),
  },
  args => {
    const values = Object.entries(args)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey, undefined, {numeric: true}))
      .map(([, value]) => value);

    const message = values.length === 1 ? values[0] : values;
    console.info('blok logger.info', message);
    toast.info(typeof message === 'string' ? message : JSON.stringify(message));
    return message;
  },
);

export const myCatalog = createBlokCatalog(
  'https://arkitekt.live/catalogs/v1.json',
  [
    ...shadcnComposableComponents,
    MyProfile,
    RawInspector,
  ],
  [myCheckFunc, multiplyFunction, loggerInfoFunction],
);
