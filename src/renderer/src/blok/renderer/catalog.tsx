import {z} from 'zod';
import {toast} from 'sonner';
import {RawInspector} from './bloks/inspector/Inspector';
import {lovekitBlokComponents} from './bloks/lovekit';
import {mikroBlokComponents} from './bloks/mikro';
import {shadcnComposableComponents} from './bloks/primitives/Primitives';
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


const gtFunction = createBlokFunction(
  {
    name: 'gt',
    returnType: 'boolean',
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  },
  args => args.a > args.b,
);


const ifFunction = createBlokFunction(
  {
    name: 'if',
    returnType: 'unknown',
    schema: z.object({
      condition: z.boolean(),
      trueValue: z.unknown(),
      falseValue: z.unknown(),
    }),
  },
  args => (args.condition ? args.trueValue : args.falseValue),
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
    ...lovekitBlokComponents,
    ...mikroBlokComponents,
    RawInspector,
  ],
  [myCheckFunc, multiplyFunction, loggerInfoFunction, gtFunction, ifFunction],
);
