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
import {
  BlokPropSchemas,
  ScopedBlokRuntimeProvider,
  createBlokComponent,
  type BlokPropHandle,
  useAction,
  useBlok,
  useValidation,
  useValue,
} from '../../runtime';

const sizeSchema = z.string().optional();
const spacingSchema = z.string().optional();
const boolSchema = z.boolean().optional();
const numberSchema = z.number().optional();
const classNameSchema = z.string().optional();
const flexDirectionSchema = z.enum(['row', 'column']).optional();
const justifySchema = z
  .enum(['start', 'center', 'end', 'between', 'around', 'evenly'])
  .optional();
const alignSchema = z
  .enum(['start', 'center', 'end', 'stretch', 'baseline'])
  .optional();
const overflowSchema = z.enum(['visible', 'hidden', 'auto', 'scroll']).optional();
const textToneSchema = z.enum(['default', 'muted', 'destructive', 'success']).optional();
const textSizeSchema = z.enum(['xs', 'sm', 'base', 'lg']).optional();
const textWeightSchema = z.enum(['regular', 'medium', 'semibold', 'bold']).optional();
const textAlignSchema = z.enum(['start', 'center', 'end']).optional();
const headingLevelSchema = z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).optional();
const badgeVariantSchema = z
  .enum(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'])
  .optional();
const buttonVariantSchema = z
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
  .optional();
const buttonSizeSchema = z
  .enum(['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'])
  .optional();
const separatorOrientationSchema = z.enum(['horizontal', 'vertical']).optional();
const foreachItemsSchema = z.array(z.unknown()).optional();
const foreachScopeSchema = z.string().optional();

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

type BaseLayoutBlok = {
  gap?: BlokPropHandle<typeof spacingSchema>;
  padding?: BlokPropHandle<typeof spacingSchema>;
  margin?: BlokPropHandle<typeof spacingSchema>;
  width?: BlokPropHandle<typeof sizeSchema>;
  minWidth?: BlokPropHandle<typeof sizeSchema>;
  maxWidth?: BlokPropHandle<typeof sizeSchema>;
  height?: BlokPropHandle<typeof sizeSchema>;
  minHeight?: BlokPropHandle<typeof sizeSchema>;
  maxHeight?: BlokPropHandle<typeof sizeSchema>;
  background?: BlokPropHandle<z.ZodOptional<z.ZodString>>;
  color?: BlokPropHandle<z.ZodOptional<z.ZodString>>;
  borderColor?: BlokPropHandle<z.ZodOptional<z.ZodString>>;
  radius?: BlokPropHandle<typeof sizeSchema>;
  overflow?: BlokPropHandle<typeof overflowSchema>;
  grow?: BlokPropHandle<typeof numberSchema>;
  shrink?: BlokPropHandle<typeof numberSchema>;
};

type TextPresentationBlok = {
  tone: BlokPropHandle<typeof textToneSchema>;
  size: BlokPropHandle<typeof textSizeSchema>;
  weight: BlokPropHandle<typeof textWeightSchema>;
  align: BlokPropHandle<typeof textAlignSchema>;
  mono: BlokPropHandle<typeof boolSchema>;
  italic: BlokPropHandle<typeof boolSchema>;
  truncate: BlokPropHandle<typeof boolSchema>;
};

const childDescriptorSchema = z.union([
  z.string(),
  z.object({
    id: z.string(),
    basePath: z.string().optional(),
  }),
]);

const childListSchema = z.array(childDescriptorSchema).optional();
const contentSchema = z.union([BlokPropSchemas.DynamicString, childDescriptorSchema, z.array(childDescriptorSchema)]).optional();

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

const ForeachIteration = (props: {
  scopeName?: string;
  itemPath?: string;
  childIds: string[];
  buildChild: ChildBuilder;
  iterationKey: string;
}) => {
  const renderedChildren = props.childIds.map(childId => (
    <React.Fragment key={`${props.iterationKey}-${childId}`}>
      {props.buildChild(childId)}
    </React.Fragment>
  ));

  if (!props.scopeName || !props.itemPath) {
    return <>{renderedChildren}</>;
  }

  return (
    <ScopedBlokRuntimeProvider pathAliases={{[props.scopeName]: props.itemPath}}>
      {renderedChildren}
    </ScopedBlokRuntimeProvider>
  );
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

const useBaseLayoutProps = (blok: BaseLayoutBlok): BaseLayoutProps => {
  const gap = useValue(blok.gap);
  const padding = useValue(blok.padding);
  const margin = useValue(blok.margin);
  const width = useValue(blok.width);
  const minWidth = useValue(blok.minWidth);
  const maxWidth = useValue(blok.maxWidth);
  const height = useValue(blok.height);
  const minHeight = useValue(blok.minHeight);
  const maxHeight = useValue(blok.maxHeight);
  const background = useValue(blok.background);
  const color = useValue(blok.color);
  const borderColor = useValue(blok.borderColor);
  const radius = useValue(blok.radius);
  const overflow = useValue(blok.overflow);
  const grow = useValue(blok.grow);
  const shrink = useValue(blok.shrink);

  return {
    gap,
    padding,
    margin,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    background,
    color,
    borderColor,
    radius,
    overflow,
    grow,
    shrink,
  };
};

const useTextPresentationProps = (blok: TextPresentationBlok) => {
  const tone = useValue(blok.tone);
  const size = useValue(blok.size);
  const weight = useValue(blok.weight);
  const align = useValue(blok.align);
  const mono = useValue(blok.mono);
  const italic = useValue(blok.italic);
  const truncate = useValue(blok.truncate);

  return {
    tone,
    size,
    weight,
    align,
    mono,
    italic,
    truncate,
  };
};

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
  children: BlokPropSchemas.ChildList,
  direction: flexDirectionSchema,
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
  background: BlokPropSchemas.DynamicString.optional(),
  color: BlokPropSchemas.DynamicString.optional(),
  borderColor: BlokPropSchemas.DynamicString.optional(),
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
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const direction = useValue(blok.direction);
    const wrap = useValue(blok.wrap);
    const justify = useValue(blok.justify);
    const align = useValue(blok.align);
    const bordered = useValue(blok.bordered);

    return (
      <div
        className={cn(
          'flex min-w-0',
          direction === 'column' ? 'flex-col' : 'flex-row',
          wrap && 'flex-wrap',
          mapJustify(justify),
          mapAlign(align),
          bordered && 'border border-border/70',
        )}
        style={buildLayoutStyle(layoutProps)}
      >
        {renderChildList(children, buildChild)}
      </div>
    );
  },
);

export const Row = createBlokComponent(
  {
    name: 'Row',
    schema: flexSchema,
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const wrap = useValue(blok.wrap);
    const justify = useValue(blok.justify);
    const align = useValue(blok.align);
    const bordered = useValue(blok.bordered);

    return (
      <div
        className={cn(
          'flex min-w-0 flex-row',
          wrap && 'flex-wrap',
          mapJustify(justify),
          mapAlign(align),
          bordered && 'border border-border/70',
        )}
        style={buildLayoutStyle(layoutProps)}
      >
        {renderChildList(children, buildChild)}
      </div>
    );
  },
);

export const Column = createBlokComponent(
  {
    name: 'Column',
    schema: flexSchema,
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const wrap = useValue(blok.wrap);
    const justify = useValue(blok.justify);
    const align = useValue(blok.align);
    const bordered = useValue(blok.bordered);

    return (
      <div
        className={cn(
          'flex min-w-0 flex-col',
          wrap && 'flex-wrap',
          mapJustify(justify),
          mapAlign(align),
          bordered && 'border border-border/70',
        )}
        style={buildLayoutStyle(layoutProps)}
      >
        {renderChildList(children, buildChild)}
      </div>
    );
  },
);

export const Grid = createBlokComponent(
  {
    name: 'Grid',
    schema: z.object({
      children: BlokPropSchemas.ChildList,
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
      background: BlokPropSchemas.DynamicString.optional(),
      borderColor: BlokPropSchemas.DynamicString.optional(),
      radius: sizeSchema,
      overflow: overflowSchema,
      bordered: boolSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const columns = useValue(blok.columns);
    const minColumnWidth = useValue(blok.minColumnWidth);
    const bordered = useValue(blok.bordered);

    const gridTemplateColumns = columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : `repeat(auto-fit, minmax(${minColumnWidth ?? '16rem'}, 1fr))`;

    return (
      <div
        className={cn('grid min-w-0', bordered && 'border border-border/70')}
        style={{
          ...buildLayoutStyle(layoutProps),
          gridTemplateColumns,
        }}
      >
        {renderChildList(children, buildChild)}
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
      background: BlokPropSchemas.DynamicString.optional(),
      color: BlokPropSchemas.DynamicString.optional(),
      borderColor: BlokPropSchemas.DynamicString.optional(),
      radius: sizeSchema,
      overflow: overflowSchema,
      grow: numberSchema,
      shrink: numberSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const className = useValue(blok.className);

    return (
      <div className={cn('min-w-0', className)} style={buildLayoutStyle(layoutProps)}>
        {renderContent(children, buildChild)}
      </div>
    );
  },
);

export const Card = createBlokComponent(
  {
    name: 'Card',
    schema: z.object({
      child: BlokPropSchemas.ComponentId.optional(),
      children: childListSchema,
      size: z.enum(['default', 'sm']).optional(),
      className: classNameSchema,
      padding: spacingSchema,
      width: sizeSchema,
      minHeight: sizeSchema,
      height: sizeSchema,
      background: BlokPropSchemas.DynamicString.optional(),
      borderColor: BlokPropSchemas.DynamicString.optional(),
      radius: sizeSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const child = useValue(blok.child);
    const children = useValue(blok.children);
    const size = useValue(blok.size);
    const className = useValue(blok.className);

    return (
      <ShadCard
        size={size ?? 'default'}
        style={buildLayoutStyle(layoutProps)}
        className={cn('min-w-0', className)}
      >
        {child ? buildChild(child) : null}
        {renderChildList(children, buildChild)}
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
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const className = useValue(blok.className);

    return (
      <ShadCardHeader className={className} style={buildLayoutStyle(layoutProps)}>
        {renderChildList(children, buildChild)}
      </ShadCardHeader>
    );
  },
);

export const CardTitle = createBlokComponent(
  {
    name: 'CardTitle',
    schema: z.object({
      text: BlokPropSchemas.DynamicString.optional(),
      children: contentSchema,
      className: classNameSchema,
      align: textAlignSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const text = useValue(blok.text);
    const children = useValue(blok.children);
    const className = useValue(blok.className);
    const align = useValue(blok.align);

    return (
      <ShadCardTitle className={cn(mapTextAlign(align), className)}>
        {renderContent(children ?? text, buildChild)}
      </ShadCardTitle>
    );
  },
);

export const CardDescription = createBlokComponent(
  {
    name: 'CardDescription',
    schema: z.object({
      text: BlokPropSchemas.DynamicString.optional(),
      children: contentSchema,
      className: classNameSchema,
      align: textAlignSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const text = useValue(blok.text);
    const children = useValue(blok.children);
    const className = useValue(blok.className);
    const align = useValue(blok.align);

    return (
      <ShadCardDescription className={cn(mapTextAlign(align), className)}>
        {renderContent(children ?? text, buildChild)}
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
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const className = useValue(blok.className);
    const gap = useValue(blok.gap);

    return (
      <ShadCardContent className={className} style={buildLayoutStyle(layoutProps)}>
        <div className="flex min-w-0 flex-col" style={{gap}}>
          {renderChildList(children, buildChild)}
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
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const layoutProps = useBaseLayoutProps(blok);
    const children = useValue(blok.children);
    const className = useValue(blok.className);
    const justify = useValue(blok.justify);
    const align = useValue(blok.align);

    return (
      <ShadCardFooter
        className={cn(mapJustify(justify), mapAlign(align), className)}
        style={buildLayoutStyle(layoutProps)}
      >
        {renderChildList(children, buildChild)}
      </ShadCardFooter>
    );
  },
);

export const Text = createBlokComponent(
  {
    name: 'Text',
    schema: z.object({
      className: classNameSchema,
      text: BlokPropSchemas.DynamicString,
      tone: textToneSchema,
      size: textSizeSchema,
      weight: textWeightSchema,
      align: textAlignSchema,
      mono: boolSchema,
      italic: boolSchema,
      truncate: boolSchema,
    }),
  },
  ({component, schema}) => {
    const blok = useBlok(component, schema);
    const text = useValue(blok.text);
    const className = useValue(blok.className);
    const textProps = useTextPresentationProps(blok);

    return (
      <p
        className={cn(
          textVariants({tone: textProps.tone, size: textProps.size, weight: textProps.weight}),
          mapTextAlign(textProps.align),
          className,
          textProps.mono && 'font-mono',
          textProps.italic && 'italic',
          textProps.truncate && 'truncate',
        )}
      >
        {text}
      </p>
    );
  },
);

export const Paragraph = createBlokComponent(
  {
    name: 'p',
    schema: z.object({
      text: BlokPropSchemas.DynamicString.optional(),
      children: contentSchema,
      tone: textToneSchema,
      size: textSizeSchema,
      weight: textWeightSchema,
      align: textAlignSchema,
      mono: boolSchema,
      italic: boolSchema,
      truncate: boolSchema,
      className: classNameSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const text = useValue(blok.text);
    const children = useValue(blok.children);
    const className = useValue(blok.className);
    const textProps = useTextPresentationProps(blok);

    return (
      <p
        className={cn(
          textVariants({tone: textProps.tone, size: textProps.size, weight: textProps.weight}),
          mapTextAlign(textProps.align),
          textProps.mono && 'font-mono',
          textProps.italic && 'italic',
          textProps.truncate && 'truncate',
          className,
        )}
      >
        {renderContent(children ?? text, buildChild)}
      </p>
    );
  },
);

export const Span = createBlokComponent(
  {
    name: 'span',
    schema: z.object({
      text: BlokPropSchemas.DynamicString.optional(),
      children: contentSchema,
      tone: textToneSchema,
      size: textSizeSchema,
      weight: textWeightSchema,
      align: textAlignSchema,
      mono: boolSchema,
      italic: boolSchema,
      truncate: boolSchema,
      className: classNameSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const text = useValue(blok.text);
    const children = useValue(blok.children);
    const className = useValue(blok.className);
    const textProps = useTextPresentationProps(blok);

    return (
      <span
        className={cn(
          textVariants({tone: textProps.tone, size: textProps.size, weight: textProps.weight}),
          mapTextAlign(textProps.align),
          textProps.mono && 'font-mono',
          textProps.italic && 'italic',
          textProps.truncate && 'truncate',
          className,
        )}
      >
        {renderContent(children ?? text, buildChild)}
      </span>
    );
  },
);

export const Heading = createBlokComponent(
  {
    name: 'Heading',
    schema: z.object({
      text: BlokPropSchemas.DynamicString,
      level: headingLevelSchema,
      align: textAlignSchema,
    }),
  },
  ({component, schema}) => {
    const blok = useBlok(component, schema);
    const text = useValue(blok.text);
    const level = useValue(blok.level);
    const align = useValue(blok.align);

    const Comp = (level ?? 'h3') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const className = cn(
      mapTextAlign(align),
      level === 'h1' && 'text-4xl font-extrabold tracking-tight',
      level === 'h2' && 'text-3xl font-bold tracking-tight',
      (!level || level === 'h3') && 'text-2xl font-semibold tracking-tight',
      level === 'h4' && 'text-xl font-semibold tracking-tight',
      level === 'h5' && 'text-lg font-semibold',
      level === 'h6' && 'text-base font-semibold uppercase tracking-wide text-muted-foreground',
    );

    return <Comp className={className}>{text}</Comp>;
  },
);

export const Badge = createBlokComponent(
  {
    name: 'Badge',
    schema: z.object({
      text: BlokPropSchemas.DynamicString.optional(),
      child: BlokPropSchemas.ComponentId.optional(),
      children: contentSchema,
      className: classNameSchema,
      variant: badgeVariantSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const text = useValue(blok.text);
    const child = useValue(blok.child);
    const children = useValue(blok.children);
    const className = useValue(blok.className);
    const variant = useValue(blok.variant);

    return (
      <ShadBadge variant={variant ?? 'default'} className={className}>
        {child ? buildChild(child) : renderContent(children ?? text, buildChild)}
      </ShadBadge>
    );
  },
);

export const Button = createBlokComponent(
  {
    name: 'Button',
    schema: z.object({
      label: BlokPropSchemas.DynamicString.optional(),
      child: BlokPropSchemas.ComponentId.optional(),
      children: contentSchema,
      onClick: BlokPropSchemas.Action.optional(),
      className: classNameSchema,
      variant: buttonVariantSchema,
      size: buttonSizeSchema,
      fullWidth: boolSchema,
      disabled: BlokPropSchemas.DynamicBoolean.optional(),
      checks: BlokPropSchemas.Checkable.shape.checks,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const validation = useValidation(component, schema);
    const label = useValue(blok.label);
    const child = useValue(blok.child);
    const children = useValue(blok.children);
    const onClick = useAction(blok.onClick);
    const className = useValue(blok.className);
    const rawVariant = useValue(blok.variant);
    const size = useValue(blok.size);
    const fullWidth = useValue(blok.fullWidth);
    const disabled = useValue(blok.disabled);

    const resolvedVariant =
      rawVariant === 'primary'
        ? 'default'
        : rawVariant === 'borderless'
          ? 'ghost'
          : rawVariant;

    return (
      <ShadButton
        variant={resolvedVariant ?? 'default'}
        size={size ?? 'default'}
        className={cn(
          fullWidth && 'w-full',
          buttonVariants({variant: resolvedVariant, size: size ?? 'default'}),
          className,
        )}
        onClick={onClick}
        disabled={disabled || validation.isValid === false}
      >
        {child ? buildChild(child) : renderContent(children ?? label, buildChild)}
      </ShadButton>
    );
  },
);

export const Input = createBlokComponent(
  {
    name: 'Input',
    schema: z.object({
      value: BlokPropSchemas.DynamicString.optional(),
      defaultValue: BlokPropSchemas.DynamicString.optional(),
      placeholder: BlokPropSchemas.DynamicString.nullish(),
      type: z.string().optional(),
      className: classNameSchema,
      disabled: BlokPropSchemas.DynamicBoolean.optional(),
      readOnly: boolSchema,
      fullWidth: boolSchema,
      action: BlokPropSchemas.Action.optional(),
    }),
  },
  ({component, schema}) => {
    const blok = useBlok(component, schema);
    const value = useValue(blok.value);
    const defaultValue = useValue(blok.defaultValue);
    const placeholder = useValue(blok.placeholder);
    const type = useValue(blok.type);
    const className = useValue(blok.className);
    const disabled = useValue(blok.disabled);
    const readOnly = useValue(blok.readOnly);
    const fullWidth = useValue(blok.fullWidth);
    const action = useAction(blok.action);

    const controlledValue = typeof value === 'string' ? value : undefined;
    const initialValue =
      controlledValue ??
      (typeof defaultValue === 'string' ? defaultValue : '');
    const resolvedPlaceholder = typeof placeholder === 'string' ? placeholder : undefined;
    const isDisabled = disabled === true;
    const [localValue, setLocalValue] = React.useState(initialValue);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setLocalValue(controlledValue);
      }
    }, [controlledValue]);

    const isControlled = controlledValue !== undefined;

    return (
      <ShadInput
        type={type ?? 'text'}
        value={isControlled ? controlledValue : localValue}
        defaultValue={isControlled ? undefined : initialValue}
        placeholder={resolvedPlaceholder}
        className={cn(fullWidth && 'w-full', className)}
        disabled={isDisabled}
        readOnly={readOnly}
        onChange={event => {
          if (!isControlled) {
            setLocalValue(event.target.value);
          }

          action?.();
        }}
      />
    );
  },
);

export const Separator = createBlokComponent(
  {
    name: 'Separator',
    schema: z.object({
      orientation: separatorOrientationSchema,
    }),
  },
  ({component, schema}) => {
    const blok = useBlok(component, schema);
    const orientation = useValue(blok.orientation);

    return <ShadSeparator orientation={orientation ?? 'horizontal'} />;
  },
);

export const Foreach = createBlokComponent(
  {
    name: 'foreach',
    schema: z.object({
      items: foreachItemsSchema,
      let: foreachScopeSchema,
    }),
  },
  ({buildChild, component, schema}) => {
    const blok = useBlok(component, schema);
    const items = useValue(blok.items);
    const scopeName = useValue(blok['let']);
    const childIds = component.children?.map(child => child.id) ?? [];
    const itemsPath = blok.items.prop?.dynamic_value?.path?.replace(/[/.]$/, '');

    if (!Array.isArray(items) || childIds.length === 0) {
      return null;
    }

    return (
      <>
        {items.map((_, index) => {
          const itemPath = itemsPath ? `${itemsPath}/${index}` : undefined;
          const iterationKey = `${component.id}-${index}`;

          return (
            <ForeachIteration
              key={iterationKey}
              scopeName={scopeName}
              itemPath={itemPath}
              childIds={childIds}
              buildChild={buildChild}
              iterationKey={iterationKey}
            />
          );
        })}
      </>
    );
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
  Foreach,
];
