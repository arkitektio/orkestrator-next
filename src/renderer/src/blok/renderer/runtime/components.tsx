import * as React from 'react';
import type {BlokComponentNode, BlokComponentProp, BlokObjectSchema} from './types';

export type BlokRenderArgs<TSchema extends BlokObjectSchema = BlokObjectSchema> = {
  props: ReadonlyArray<BlokComponentProp>;
  buildChild: (id: string, basePath?: string) => React.ReactNode;
  component: BlokComponentNode;
  schema: TSchema;
};

export type BlokComponentDefinition = {
  name: string;
  schema: BlokObjectSchema;
  render: React.ComponentType<BlokRenderArgs>;
};

export const createBlokComponent = <TSchema extends BlokObjectSchema>(
  api: {name: string; schema: TSchema},
  render: React.ComponentType<BlokRenderArgs<TSchema>>,
): BlokComponentDefinition => ({
  name: api.name,
  schema: api.schema,
  render: render as React.ComponentType<BlokRenderArgs>,
});

export const BlokComponentRenderer = (props: {
  definition: BlokComponentDefinition;
  props: ReadonlyArray<BlokComponentProp>;
  buildChild: (id: string, basePath?: string) => React.ReactNode;
  component: BlokComponentNode;
}) => {
  const RenderComponent = props.definition.render;

  return (
    <RenderComponent
      props={props.props}
      buildChild={props.buildChild}
      component={props.component}
      schema={props.definition.schema}
    />
  );
};
