import {z} from 'zod';
import {toast} from 'sonner';
import {RawInspector} from './bloks/inspector/Inspector';
import {lovekitBlokComponents} from './bloks/lovekit';
import {shadcnComposableComponents} from './bloks/primitives/Primitives';
import {createBlokCatalog, createBlokFunction} from './runtime';

/*
 * `pure` functions may be evaluated while rendering to compute a prop value.
 * `effect` functions (the default) are only legal in action position, so they
 * cannot fire on every render or every store update.
 */

const isAdminFunction = createBlokFunction(
  {
    name: 'is_admin',
    returnType: 'boolean',
    purity: 'pure',
    schema: z.object({role: z.string()}),
  },
  args => args.role === 'admin',
);

const multiplyFunction = createBlokFunction(
  {
    name: 'math.multiply',
    returnType: 'number',
    purity: 'pure',
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
    purity: 'pure',
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
    purity: 'pure',
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
    // Toasts and logs: only valid behind an action, never as a prop value.
    purity: 'effect',
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

export const defaultBlokCatalog = createBlokCatalog(
  'https://arkitekt.live/catalogs/v1.json',
  [...shadcnComposableComponents, ...lovekitBlokComponents, RawInspector],
  [isAdminFunction, multiplyFunction, loggerInfoFunction, gtFunction, ifFunction],
);
