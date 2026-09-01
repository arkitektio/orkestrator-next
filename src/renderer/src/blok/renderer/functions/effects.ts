import {z} from 'zod';
import {toast} from 'sonner';
import {createBlokFunction, createVariadicBlokFunction} from '../runtime';
import {textSchema} from './argumentSchemas';

/**
 * Effectful functions. These are refused in value position by the preflight and
 * only run from an action prop, so they cannot fire on every render.
 */

const describe = (values: unknown[]): unknown => (values.length === 1 ? values[0] : values);

const asMessage = (message: unknown): string =>
  typeof message === 'string' ? message : JSON.stringify(message) ?? String(message);

const TOAST_BY_LEVEL = {
  info: 'info',
  warn: 'warning',
  error: 'error',
} as const;

const createLoggerFunction = (level: 'info' | 'warn' | 'error') =>
  createVariadicBlokFunction(
    {
      name: `logger.${level}`,
      description: `Logs its arguments and shows a ${level} toast.`,
      returnType: 'unknown',
      purity: 'effect',
      item: z.unknown(),
      min: 1,
    },
    values => {
      const message = describe(values);
      // Resolved at call time, not captured at module load, so the sink stays
      // whatever `console`/`toast` is when the action actually fires.
      console[level](`blok logger.${level}`, message);
      toast[TOAST_BY_LEVEL[level]](asMessage(message));
      return message;
    },
  );

const copyFunction = createBlokFunction(
  {
    name: 'clipboard.copy',
    description: 'Copies a value to the clipboard.',
    returnType: 'void',
    purity: 'effect',
    schema: z.object({value: textSchema, message: textSchema.optional()}),
  },
  args => {
    if (!navigator?.clipboard) {
      throw new Error('The clipboard is not available in this context.');
    }

    void navigator.clipboard
      .writeText(args.value)
      .then(() => toast.success(args.message ?? 'Copied to clipboard.'))
      .catch(() => toast.error('Could not copy to the clipboard.'));
  },
);

export const effectFunctions = [
  createLoggerFunction('info'),
  createLoggerFunction('warn'),
  createLoggerFunction('error'),
  copyFunction,
];
