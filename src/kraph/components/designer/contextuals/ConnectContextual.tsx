import { FormDialog, useFormDialog } from "@/components/dialog/FormDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import {
  ListSearchField,
  SearchOptions,
} from "@/components/fields/ListSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import {
  DialogFooter
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  CreateMeasurementCategoryMutationVariables,
  CreateRelationCategoryMutationVariables,
  CreateStepCategoryMutationVariables,
  MeasurementKind,
  OntologyFragment,
  useSearchProtocolStepTemplatesLazyQuery,
  useSearchProtocolStepTemplatesQuery
} from "@/kraph/api/graphql";
import { cn } from "@/lib/utils";
import { smartRegistry } from "@/providers/smart/registry";
import { ContextualContainer } from "@/reaktion/edit/components/ContextualContainer";
import { useForm } from "react-hook-form";
import { ConnectContextualParams, StagingEdgeParams } from "../types";
import { labelToEdgeAgeName } from "../utils";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";

const search = async ({ search, values }: SearchOptions) => {
  const models = smartRegistry
    .registeredModels()
    .filter((model) => {
      if (values) return values.includes(model.identifier);
      if (search) return model.identifier.includes(search);
      if (!search) return true;
      return false;
    })
    .map((model) => ({
      label: model.identifier,
      value: model.identifier,
    }));
  return models || [];
};

export const RelationForm = (props: {
  params: ConnectContextualParams;
  ontology: OntologyFragment;
  addStagingEdge: (params: StagingEdgeParams) => void;
}) => {
  const run = useFormDialog();

  const form = useForm<CreateRelationCategoryMutationVariables["input"]>({
    defaultValues: {
      label: "",
      ontology: props.ontology.id,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            run.onSubmit(data);
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="Label"
                name="label"
                description="Add a label"
              />

              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export const StepForm = (props: {
  params: ConnectContextualParams;
  ontology: OntologyFragment;
  addStagingEdge: (params: StagingEdgeParams) => void;
}) => {
  const run = useFormDialog();

  const form = useForm<CreateRelationCategoryMutationVariables["input"]>({
    defaultValues: {
      label: "",
      ontology: props.ontology.id,
    },
  });

  const [ search] = useSearchProtocolStepTemplatesLazyQuery()

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            run.onSubmit(data);
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <GraphQLSearchField
                label="The Template"
                name="template"
                searchQuery={search}
                description="Which template to choose"
              />

              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export const MeasurmentForm = (props: {
  params: ConnectContextualParams;
  ontology: OntologyFragment;
  addStagingEdge: (params: StagingEdgeParams) => void;
}) => {
  const run = useFormDialog();

  const form = useForm<CreateMeasurementCategoryMutationVariables["input"]>({
    defaultValues: {
      label: "",
      ontology: props.ontology.id,
      kind: MeasurementKind.Float,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            run.onSubmit(data);
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="Label"
                name="label"
                description="Add a label"
              />

              <ParagraphField
                label="Description"
                name="description"
                description="Add a description"
              />

              <ChoicesField
                label="Data Kind"
                name="dataKind"
                description="Select a data kind"
                options={[
                  { label: "Float", value: MeasurementKind.Float },
                  { label: "Integer", value: MeasurementKind.Int },
                  { label: "String", value: MeasurementKind.String },
                ]}
              />

              <ListSearchField
                search={search}
                label="Allowed Structures"
                name="measuring_structures"
                description="Search for a structure that is allowed to measure this"
              />

              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export const ConnectContextual = (props: {
  params: ConnectContextualParams;
  ontology: OntologyFragment;
  addStagingEdge: (params: StagingEdgeParams) => void;
  onCancel: () => void;
}) => {
  const onSubmitMeasurement = async (
    data: CreateMeasurementCategoryMutationVariables["input"],
  ) => {
    await props.addStagingEdge({
      data: data,
      ageName: labelToEdgeAgeName(data.label),
      type: "stagingmeasurement",
      source: props.params.leftNode.id,
      target: props.params.rightNode.id,
    });
  };

  const onSubmitRelation = async (
    data: CreateRelationCategoryMutationVariables["input"],
  ) => {
    await props.addStagingEdge({
      data: data,
      ageName: labelToEdgeAgeName(data.label),
      type: "stagingrelation",
      source: props.params.leftNode.id,
      target: props.params.rightNode.id,
    });
  };

  const onSubmitStep = async (
    data: CreateStepCategoryMutationVariables["input"],
  ) => {
    await props.addStagingEdge({
      data: data,
      ageName: labelToEdgeAgeName(data.template),
      type: "stagingstep",
      source: props.params.leftNode.id,
      target: props.params.rightNode.id,
    });
  };

  return (
    <ContextualContainer
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
      active={true}
    >
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <FormDialog
          trigger={
            <Button className={cn("flex flex-row items-center justify-center")}  variant={"outline"} size="sm">
              Add Relation
            </Button>
          }
          onSubmit={onSubmitRelation}
          onError={props.onCancel}
        >
          <RelationForm
            ontology={props.ontology}
            addStagingEdge={props.addStagingEdge}
            params={props.params}
          />
        </FormDialog>
        <FormDialog
          trigger={
            <Button className={cn("flex flex-row items-center justify-center")}  variant={"outline"} size="sm">
              Add Measurement
            </Button>
          }
          onSubmit={onSubmitMeasurement}
          onError={props.onCancel}
        >
          <MeasurmentForm
            ontology={props.ontology}
            addStagingEdge={props.addStagingEdge}
            params={props.params}
          />
        </FormDialog>
        <FormDialog
          trigger={
            <Button className={cn("flex flex-row items-center justify-center")}  variant={"outline"} size="sm">
              Add Alteration Step
            </Button>
          }
          onSubmit={onSubmitStep}
          onError={props.onCancel}
        >
          <StepForm
            ontology={props.ontology}
            addStagingEdge={props.addStagingEdge}
            params={props.params}
          />
        </FormDialog>
      </div>
    </ContextualContainer>
  );
};
