import { FormDialog, useFormDialog } from "@/components/dialog/FormDialog";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  CreateGenericCategoryMutationVariables,
  CreateStructureCategoryMutationVariables,
  OntologyFragment,
} from "@/kraph/api/graphql";
import { cn } from "@/lib/utils";
import { smartRegistry } from "@/providers/smart/registry";
import { ContextualContainer } from "@/reaktion/edit/components/ContextualContainer";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClickContextualParams, StagingNodeParams } from "../types";
import { identifierToNodeAgeName, labelToNodeAgeName } from "../utils";

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

export const StructureForm = (props: {
  params: ClickContextualParams;
  ontology: OntologyFragment;
  addStagingNode: (params: StagingNodeParams) => void;
}) => {
  const run = useFormDialog();

  const form = useForm<CreateStructureCategoryMutationVariables["input"]>({
    defaultValues: {
      identifier: "",
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
              <SearchField
                search={search}
                label="Search"
                name="identifier"
                description="Search for a structure"
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

export const GenericForm = (props: {
  params: ClickContextualParams;
  ontology: OntologyFragment;
  addStagingNode: (params: StagingNodeParams) => void;
}) => {
  const run = useFormDialog();

  const form = useForm<CreateGenericCategoryMutationVariables["input"]>({
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

              <ParagraphField
                label="Description"
                name="description"
                description="Add a description"
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

export const ClickContextual = (props: {
  params: ClickContextualParams;
  ontology: OntologyFragment;
  addStagingNode: (params: StagingNodeParams) => void;
  onCancel: () => void;
}) => {
  const [search, setSearch] = useState(undefined);

  const onSubmit =  (
    data: CreateStructureCategoryMutationVariables["input"],
  ) => {
    props.addStagingNode({
      data: data,
      ageName: identifierToNodeAgeName(data.identifier),
      type: "stagingstructure",
      event: props.params.event,
    });
  };

  const onSubmitGeneric =  (
    data: CreateGenericCategoryMutationVariables["input"],
  ) => {
    props.addStagingNode({
      data: data,
      ageName: labelToNodeAgeName(data.label),
      type: "staginggeneric",
      event: props.params.event,
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
              Structure
            </Button>
          }
          onSubmit={onSubmit}
          onError={props.onCancel}
        >
          <StructureForm
            ontology={props.ontology}
            addStagingNode={props.addStagingNode}
            params={props.params}
          />
        </FormDialog>
        <FormDialog
          trigger={
            <Button className={cn("flex flex-row items-center justify-center")} variant={"outline"} size="sm">
              Entitiy
            </Button>
          }
          onSubmit={onSubmitGeneric}
          onError={props.onCancel}
        >
          <GenericForm
            ontology={props.ontology}
            addStagingNode={props.addStagingNode}
            params={props.params}
          />
        </FormDialog>
      </div>
    </ContextualContainer>
  );
};
