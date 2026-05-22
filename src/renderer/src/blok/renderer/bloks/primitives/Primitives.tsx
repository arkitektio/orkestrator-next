import * as React from 'react';
import {Badge as ShadBadge} from '@/components/ui/badge';
import {
  Button as ShadButton,
  buttonVariants,
} from '@/components/ui/button';
import {
  Card as ShadCard,
  CardContent as ShadCardContent,
  CardDescription as ShadCardDescription,
  CardFooter as ShadCardFooter,
  CardHeader as ShadCardHeader,
  CardTitle as ShadCardTitle,
} from '@/components/ui/card';
import {Input as ShadInput} from '@/components/ui/input';
import {Separator as ShadSeparator} from '@/components/ui/separator';
import {cn} from '@/lib/utils';
import {cva} from 'class-variance-authority';
import * as z from 'zod';
import {BlokSchemas, createBlokComponent} from '../../runtime';

const sizeSchema = z.string().optional();
const spacingSchema = z.string().optional();
const boolSchema = z.boolean().optional();
const numberSchema = z.number().optional();
const classNameSchema = z.string().optional();
const justifySchema = z
  .enum(['start', 'center', 'end', 'between', 'around', 'evenly'])
  .optional();
const alignSchema = z
  .enum(['start', 'center', 'end', 'stretch', 'baseline'])
  .optional();
const overflowSchema = z.enum(['visible', 'hidden', 'auto', 'scroll']).optional();

type ChildBuilder = (id: string, basePath?: string) => React.ReactNode;

type BaseLayoutProps = {
  gap?: string;
  padding?: string;
  margin?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  background?: string;
  color?: string;
  borderColor?: string;
  radius?: string;
  overflow?: 'visible' | 'hidden' | 'auto' | 'scroll';
  grow?: number;
  shrink?: number;
};

type ChildDescriptor = string | {id: string; basePath?: string};

const childDescriptorSchema = z.union([
  z.string(),
  z.object({
    id: z.string(),
    basePath: z.string().optional(),
  }),
]);

const childListSchema = z.array(childDescriptorSchema).optional();
const contentSchema = z.union([BlokSchemas.DynamicString, childDescriptorSchema, z.array(childDescriptorSchema)]).optional();

const renderChildList = (
  childList: unknown,
  buildChild: ChildBuilder,
): React.ReactNode => {
  if (!Array.isArray(childList)) {
    return null;
  }

  return childList.map((item, index) => {
    if (typeof item === 'string') {
      return <React.Fragment key={`${item}-${index}`}>{buildChild(item)}</React.Fragment>;
    }

    if (item && typeof item === 'object' && 'id' in item) {
      const child = item as Extract<ChildDescriptor, {id: string}>;
      return (
        <React.Fragment key={`${child.id}-${index}`}>
          {buildChild(child.id, child.basePath)}
        </React.Fragment>
      );
    }

    return null;
  });
};

const renderContent = (
  content: unknown,
  buildChild: ChildBuilder,
): React.ReactNode => {
  if (typeof content === 'string' || typeof content === 'number') {
    return content;
  }

  if (Array.isArray(content)) {
    return renderChildList(content, buildChild);
  }

  if (content && typeof content === 'object' && 'id' in content) {
    const child = content as Extract<ChildDescriptor, {id: string}>;
    return buildChild(child.id, child.basePath);
  }

  return null;
};

const buildLayoutStyle = (props: BaseLayoutProps): React.CSSProperties => ({
  gap: props.gap,
  padding: props.padding,
  margin: props.margin,
  width: props.width,
  minWidth: props.minWidth,
  maxWidth: props.maxWidth,
  height: props.height,
  minHeight: props.minHeight,
  maxHeight: props.maxHeight,
  background: props.background,
  color: props.color,
  borderColor: props.borderColor,
  borderRadius: props.radius,
  overflow: props.overflow,
  flexGrow: props.grow,
  flexShrink: props.shrink,
});

const mapJustify = (justify?: z.infer<typeof justifySchema>) => {
  switch (justify) {
    case 'center':
      return 'justify-center';
    case 'end':
      return 'justify-end';
    case 'between':
      return 'justify-between';
    case 'around':
      return 'justify-around';
    case 'evenly':
      return 'justify-evenly';
    case 'start':
    default:
      return 'justify-start';
  }
};

const mapAlign = (align?: z.infer<typeof alignSchema>) => {
  switch (align) {
    case 'center':
      return 'items-center';
    case 'end':
      return 'items-end';
    case 'baseline':
      return 'items-baseline';
    case 'stretch':
      return 'items-stretch';
    case 'start':
    default:
      return 'items-start';
  }
};

const mapTextAlign = (align?: 'start' | 'center' | 'end') => {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'end':
      return 'text-right';
    case 'start':
    default:
      return 'text-left';
  }
};

const textVariants = cva('text-sm leading-relaxed', {
  variants: {
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-emerald-600 dark:text-emerald-400',
    },
    size: {
      xs: 'text-xs leading-relaxed',
      sm: 'text-sm leading-relaxed',
      base: 'text-base leading-7',
      lg: 'text-lg leading-8',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    tone: 'default',
    size: 'sm',
    weight: 'regular',
  },
});

const flexSchema = z.object({
  children: BlokSchemas.ChildList,
  direction: z.enum(['row', 'column']).optional(),
  wrap: boolSchema,
  justify: justifySchema,
  align: alignSchema,
  bordered: boolSchema,
  gap: spacingSchema,
  padding: spacingSchema,
  margin: spacingSchema,
  width: sizeSchema,
  minWidth: sizeSchema,
  maxWidth: sizeSchema,
  height: sizeSchema,
  minHeight: sizeSchema,
  maxHeight: sizeSchema,
  background: BlokSchemas.DynamicString.optional(),
  color: BlokSchemas.DynamicString.optional(),
  borderColor: BlokSchemas.DynamicString.optional(),
  radius: sizeSchema,
  overflow: overflowSchema,
  grow: numberSchema,
  shrink: numberSchema,
});

export const Flex = createBlokComponent(
  {
    name: 'Flex',
    schema: flexSchema,
  },
  ({props, buildChild}) => {
    return (
      <div
        className={cn(
          'flex min-w-0',
          props.direction === 'column' ? 'flex-col' : 'flex-row',
          props.wrap && 'flex-wrap',
          mapJustify(props.justify),
          mapAlign(props.align),
          props.bordered && 'border border-border/70',
        )}
        style={buildLayoutStyle(props)}
      >
        {renderChildList(props.children, buildChild)}
      </div>
    );
  },
);

export const Row = createBlokComponent(
  {
    name: 'Row',
    schema: flexSchema,
  },
  ({props, buildChild}) => {
    return (
      <div
        className={cn(
          'flex min-w-0 flex-row',
          props.wrap && 'flex-wrap',
          mapJustify(props.justify),
          mapAlign(props.align),
          props.bordered && 'border border-border/70',
        )}
        style={buildLayoutStyle(props)}
      >
        {renderChildList(props.children, buildChild)}
      </div>
    );
  },
);

export const Column = createBlokComponent(
  {
    name: 'Column',
    schema: flexSchema,
  },
  ({props, buildChild}) => {
    return (
      <div
        className={cn(
          'flex min-w-0 flex-col',
          props.wrap && 'flex-wrap',
          mapJustify(props.justify),
          mapAlign(props.align),
          props.bordered && 'border border-border/70',
        )}
        style={buildLayoutStyle(props)}
      >
        {renderChildList(props.children, buildChild)}
      </div>
    );
  },
);

export const Grid = createBlokComponent(
  {
    name: 'Grid',
    schema: z.object({
      children: BlokSchemas.ChildList,
      columns: z.number().int().min(1).optional(),
      minColumnWidth: sizeSchema,
      gap: spacingSchema,
      padding: spacingSchema,
      margin: spacingSchema,
      width: sizeSchema,
      minWidth: sizeSchema,
      maxWidth: sizeSchema,
      height: sizeSchema,
      minHeight: sizeSchema,
      maxHeight: sizeSchema,
      background: BlokSchemas.DynamicString.optional(),
      borderColor: BlokSchemas.DynamicString.optional(),
      radius: sizeSchema,
      overflow: overflowSchema,
      bordered: boolSchema,
    }),
  },
  ({props, buildChild}) => {
    const gridTemplateColumns = props.columns
      ? `repeat(${props.columns}, minmax(0, 1fr))`
      : `repeat(auto-fit, minmax(${props.minColumnWidth ?? '16rem'}, 1fr))`;

    return (
      <div
        className={cn('grid min-w-0', props.bordered && 'border border-border/70')}
        style={{
          ...buildLayoutStyle(props),
          gridTemplateColumns,
        }}
      >
        {renderChildList(props.children, buildChild)}
      </div>
    );
  },
);

export const Div = createBlokComponent(
  {
    name: 'div',
    schema: z.object({
      children: contentSchema,
      className: classNameSchema,
      gap: spacingSchema,
      padding: spacingSchema,
      margin: spacingSchema,
      width: sizeSchema,
      minWidth: sizeSchema,
      maxWidth: sizeSchema,
      height: sizeSchema,
      minHeight: sizeSchema,
      maxHeight: sizeSchema,
      background: BlokSchemas.DynamicString.optional(),
      color: BlokSchemas.DynamicString.optional(),
      borderColor: BlokSchemas.DynamicString.optional(),
      radius: sizeSchema,
      overflow: overflowSchema,
      grow: numberSchema,
      shrink: numberSchema,
    }),
  },
  ({props, buildChild}) => {
    return (
      <div className={cn('min-w-0', props.className)} style={buildLayoutStyle(props)}>
        {renderContent(props.children, buildChild)}
      </div>
    );
  },
);

export const Card = createBlokComponent(
  {
    name: 'Card',
    schema: z.object({
      child: BlokSchemas.ComponentId.optional(),
      children: childListSchema,
      size: z.enum(['default', 'sm']).optional(),
      className: classNameSchema,
      padding: spacingSchema,
      width: sizeSchema,
      minHeight: sizeSchema,
      height: sizeSchema,
      background: BlokSchemas.DynamicString.optional(),
      borderColor: BlokSchemas.DynamicString.optional(),
      radius: sizeSchema,
    }),
  },
  ({props, buildChild}) => {
    return (
      <ShadCard
        size={props.size ?? 'default'}
        style={buildLayoutStyle(props)}
        className={cn('min-w-0', props.className)}
      >
        {props.child ? buildChild(props.child) : null}
        {renderChildList(props.children, buildChild)}
      </ShadCard>
    );
  },
);

export const CardHeader = createBlokComponent(
  {
    name: 'CardHeader',
    schema: z.object({
      children: childListSchema,
      className: classNameSchema,
      padding: spacingSchema,
      gap: spacingSchema,
    }),
  },
  ({props, buildChild}) => {
    return (
      <ShadCardHeader className={props.className} style={buildLayoutStyle(props)}>
        {renderChildList(props.children, buildChild)}
      </ShadCardHeader>
    );
  },
);

export const CardTitle = createBlokComponent(
  {
    name: 'CardTitle',
    schema: z.object({
      text: BlokSchemas.DynamicString.optional(),
      children: contentSchema,
      className: classNameSchema,
      align: z.enum(['start', 'center', 'end']).optional(),
    }),
  },
  ({props, buildChild}) => {
    return (
      <ShadCardTitle className={cn(mapTextAlign(props.align), props.className)}>
        {renderContent(props.children ?? props.text, buildChild)}
      </ShadCardTitle>
    );
  },
);

export const CardDescription = createBlokComponent(
  {
    name: 'CardDescription',
    schema: z.object({
      text: BlokSchemas.DynamicString.optional(),
      children: contentSchema,
      className: classNameSchema,
      align: z.enum(['start', 'center', 'end']).optional(),
    }),
  },
  ({props, buildChild}) => {
    return (
      <ShadCardDescription className={cn(mapTextAlign(props.align), props.className)}>
        {renderContent(props.children ?? props.text, buildChild)}
      </ShadCardDescription>
    );
  },
);

export const CardContent = createBlokComponent(
  {
    name: 'CardContent',
    schema: z.object({
      children: childListSchema,
      className: classNameSchema,
      padding: spacingSchema,
      gap: spacingSchema,
    }),
  },
  ({props, buildChild}) => {
    return (
      <ShadCardContent className={props.className} style={buildLayoutStyle(props)}>
        <div className="flex min-w-0 flex-col" style={{gap: props.gap}}>
          {renderChildList(props.children, buildChild)}
        </div>
      </ShadCardContent>
    );
  },
);

export const CardFooter = createBlokComponent(
  {
    name: 'CardFooter',
    schema: z.object({
      children: childListSchema,
      className: classNameSchema,
      justify: justifySchema,
      align: alignSchema,
      gap: spacingSchema,
      padding: spacingSchema,
    }),
  },
  ({props, buildChild}) => {
    return (
      <ShadCardFooter
        className={cn(mapJustify(props.justify), mapAlign(props.align), props.className)}
        style={buildLayoutStyle(props)}
      >
        {renderChildList(props.children, buildChild)}
      </ShadCardFooter>
    );
  },
);

export const Text = createBlokComponent(
  {
    name: 'Text',
    schema: z.object({
      text: BlokSchemas.DynamicString,
      tone: z.enum(['default', 'muted', 'destructive', 'success']).optional(),
      size: z.enum(['xs', 'sm', 'base', 'lg']).optional(),
      weight: z.enum(['regular', 'medium', 'semibold', 'bold']).optional(),
      align: z.enum(['start', 'center', 'end']).optional(),
      mono: boolSchema,
      italic: boolSchema,
      truncate: boolSchema,
    }),
  },
  ({props}) => {
    return (
      <p
        className={cn(
          textVariants({tone: props.tone, size: props.size, weight: props.weight}),
          mapTextAlign(props.align),
          props.mono && 'font-mono',
          props.italic && 'italic',
          props.truncate && 'truncate',
        )}
      >
        {props.text}
      </p>
    );
  },
);

export const Paragraph = createBlokComponent(
  {
    name: 'p',
    schema: z.object({
      text: BlokSchemas.DynamicString.optional(),
      children: contentSchema,
      tone: z.enum(['default', 'muted', 'destructive', 'success']).optional(),
      size: z.enum(['xs', 'sm', 'base', 'lg']).optional(),
      weight: z.enum(['regular', 'medium', 'semibold', 'bold']).optional(),
      align: z.enum(['start', 'center', 'end']).optional(),
      mono: boolSchema,
      italic: boolSchema,
      truncate: boolSchema,
      className: classNameSchema,
    }),
  },
  ({props, buildChild}) => {
    return (
      <p
        className={cn(
          textVariants({tone: props.tone, size: props.size, weight: props.weight}),
          mapTextAlign(props.align),
          props.mono && 'font-mono',
          props.italic && 'italic',
          props.truncate && 'truncate',
          props.className,
        )}
      >
        {renderContent(props.children ?? props.text, buildChild)}
      </p>
    );
  },
);

export const Span = createBlokComponent(
  {
    name: 'span',
    schema: z.object({
      text: BlokSchemas.DynamicString.optional(),
      children: contentSchema,
      tone: z.enum(['default', 'muted', 'destructive', 'success']).optional(),
      size: z.enum(['xs', 'sm', 'base', 'lg']).optional(),
      weight: z.enum(['regular', 'medium', 'semibold', 'bold']).optional(),
      align: z.enum(['start', 'center', 'end']).optional(),
      mono: boolSchema,
      italic: boolSchema,
      truncate: boolSchema,
      className: classNameSchema,
    }),
  },
  ({props, buildChild}) => {
    return (
      <span
        className={cn(
          textVariants({tone: props.tone, size: props.size, weight: props.weight}),
          mapTextAlign(props.align),
          props.mono && 'font-mono',
          props.italic && 'italic',
          props.truncate && 'truncate',
          props.className,
        )}
      >
        {renderContent(props.children ?? props.text, buildChild)}
      </span>
    );
  },
);

export const Heading = createBlokComponent(
  {
    name: 'Heading',
    schema: z.object({
      text: BlokSchemas.DynamicString,
      level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).optional(),
      align: z.enum(['start', 'center', 'end']).optional(),
    }),
  },
  ({props}) => {
    const Comp = (props.level ?? 'h3') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const className = cn(
      mapTextAlign(props.align),
      props.level === 'h1' && 'text-4xl font-extrabold tracking-tight',
      props.level === 'h2' && 'text-3xl font-bold tracking-tight',
      (!props.level || props.level === 'h3') && 'text-2xl font-semibold tracking-tight',
      props.level === 'h4' && 'text-xl font-semibold tracking-tight',
      props.level === 'h5' && 'text-lg font-semibold',
      props.level === 'h6' && 'text-base font-semibold uppercase tracking-wide text-muted-foreground',
    );

    return <Comp className={className}>{props.text}</Comp>;
  },
);

export const Badge = createBlokComponent(
  {
    name: 'Badge',
    schema: z.object({
      text: BlokSchemas.DynamicString.optional(),
      child: BlokSchemas.ComponentId.optional(),
      children: contentSchema,
      className: classNameSchema,
      variant: z
        .enum(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'])
        .optional(),
    }),
  },
  ({props, buildChild}) => {
    return (
      <ShadBadge variant={props.variant ?? 'secondary'} className={props.className}>
        {props.child
          ? buildChild(props.child)
          : renderContent(props.children ?? props.text, buildChild)}
      </ShadBadge>
    );
  },
);

export const Button = createBlokComponent(
  {
    name: 'Button',
    schema: z.object({
      label: BlokSchemas.DynamicString.optional(),
      child: BlokSchemas.ComponentId.optional(),
      children: contentSchema,
      action: BlokSchemas.Action.optional(),
      className: classNameSchema,
      variant: z
        .enum([
          'default',
          'outline',
          'secondary',
          'ghost',
          'destructive',
          'link',
          'primary',
          'borderless',
        ])
        .optional(),
      size: z
        .enum(['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'])
        .optional(),
      fullWidth: boolSchema,
      disabled: BlokSchemas.DynamicBoolean.optional(),
      checks: BlokSchemas.Checkable.shape.checks,
    }),
  },
  ({props, buildChild}) => {
    const variant =
      props.variant === 'primary'
        ? 'default'
        : props.variant === 'borderless'
          ? 'ghost'
          : props.variant;

    return (
      <ShadButton
        variant={variant ?? 'default'}
        size={props.size ?? 'default'}
        className={cn(
          props.fullWidth && 'w-full',
          buttonVariants({variant, size: props.size ?? 'default'}),
          props.className,
        )}
        onClick={props.action}
        disabled={props.disabled || props.isValid === false}
      >
        {props.child
          ? buildChild(props.child)
          : renderContent(props.children ?? props.label, buildChild)}
      </ShadButton>
    );
  },
);

export const Input = createBlokComponent(
  {
    name: 'Input',
    schema: z.object({
      value: BlokSchemas.DynamicString.optional(),
      defaultValue: BlokSchemas.DynamicString.optional(),
      placeholder: BlokSchemas.DynamicString.nullish(),
      type: z.string().optional(),
      className: classNameSchema,
      disabled: BlokSchemas.DynamicBoolean.optional(),
      readOnly: boolSchema,
      fullWidth: boolSchema,
      action: BlokSchemas.Action.optional(),
    }),
  },
  ({props}) => {
    const controlledValue = typeof props.value === 'string' ? props.value : undefined;
    const initialValue =
      controlledValue ??
      (typeof props.defaultValue === 'string' ? props.defaultValue : '');
    const placeholder = typeof props.placeholder === 'string' ? props.placeholder : undefined;
    const disabled = props.disabled === true;
    const [localValue, setLocalValue] = React.useState(initialValue);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setLocalValue(controlledValue);
      }
    }, [controlledValue]);

    const isControlled = controlledValue !== undefined;

    return (
      <ShadInput
        type={props.type ?? 'text'}
        value={isControlled ? controlledValue : localValue}
        defaultValue={isControlled ? undefined : initialValue}
        placeholder={placeholder}
        className={cn(props.fullWidth && 'w-full', props.className)}
        disabled={disabled}
        readOnly={props.readOnly}
        onChange={event => {
          if (!isControlled) {
            setLocalValue(event.target.value);
          }

          if (typeof props.action === 'function') {
            props.action();
          }
        }}
      />
    );
  },
);

export const Separator = createBlokComponent(
  {
    name: 'Separator',
    schema: z.object({
      orientation: z.enum(['horizontal', 'vertical']).optional(),
    }),
  },
  ({props}) => {
    return <ShadSeparator orientation={props.orientation ?? 'horizontal'} />;
  },
);

export const shadcnComposableComponents = [
  Flex,
  Row,
  Column,
  Grid,
  Div,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Text,
  Paragraph,
  Span,
  Heading,
  Badge,
  Button,
  Input,
  Separator,
];
