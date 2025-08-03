import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateReagentMutationVariables,
  EntityRoleDefinitionFragment,
  MetricKind,
  ProtocolEventCategory,
  ProtocolEventCategoryFragment,
  ReagentRoleDefinitionFragment,
  useCreateReagentMutation,
  useGetProtocolEventCategoryQuery,
  useRecordProtocolEventMutation,
  useSearchEntitiesForRoleLazyQuery,
  useSearchEntitiesLazyQuery,
  useSearchReagentsForRoleLazyQuery,
  VariableDefinitionFragment,
} from "../api/graphql";
import { GraphQLListSearchField as GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { IntField } from "@/components/fields/IntField";
import { FloatField } from "@/components/fields/FloatField";
import { DateField } from "@/components/fields/DateField";

export const EntityRoleInput = ({
  role,
}: {
  role: EntityRoleDefinitionFragment;
}) => {
  const [search] = useSearchEntitiesForRoleLazyQuery({
    variables: {
      tags: role?.categoryDefinition?.tagFilters?.map((tag) => tag) || [],
      categories:
        role?.categoryDefinition?.categoryFilters?.map((cat) => cat) || [],
    },
  });

  return (
    <div key={role.role} className="col-span-2 flex-col gap-1 flex">
      {role.allowMultiple ? (
        <GraphQLListSearchField
          searchQuery={search}
          name={role.role}
          description={role.description || ""}
          label={role.label || role.role}
          createComponent={<> Create new </>}
        />
      ) : (
        <GraphQLSearchField
          name={role.role}
          searchQuery={search}
          description={role.description || ""}
          label={role.label || role.role}
          createComponent={<> Create new </>}
        />
      )}
    </div>
  );
};

export const ReagentRoleInput = ({
  role,
}: {
  role: ReagentRoleDefinitionFragment;
}) => {
  const [search] = useSearchReagentsForRoleLazyQuery({
    variables: {
      tags: role?.categoryDefinition?.tagFilters?.map((tag) => tag) || [],
      categories:
        role?.categoryDefinition?.categoryFilters?.map((cat) => cat) || [],
    },
  });

  return (
    <div key={role.role} className="col-span-2 flex-col gap-1 flex">
      {role.allowMultiple ? (
        <GraphQLListSearchField
          searchQuery={search}
          name={role.role}
          label={role.label || role.role}
          description={role.description || ""}
        />
      ) : (
        <GraphQLSearchField
          name={role.role}
          searchQuery={search}
          label={role.label || role.role}
          description={role.description || ""}
        />
      )}
    </div>
  );
};

export const VariableParamInput = ({
  variable,
}: {
  variable: VariableDefinitionFragment;
}) => {
  return (
    <div key={variable.param} className="col-span-2 flex-col gap-1 flex">
      {variable.valueKind === MetricKind.String && (
        <StringField
          name={variable.param}
          description={variable.description || ""}
          label={variable.label || variable.param}
        />
      )}
      {variable.valueKind === MetricKind.Int && (
        <IntField
          name={variable.param}
          description={variable.description || ""}
          label={variable.label || variable.param}
        />
      )}
      {variable.valueKind === MetricKind.Float && (
        <FloatField
          name={variable.param}
          description={variable.description || ""}
          label={variable.label || variable.param}
        />
      )}
      {variable.valueKind === MetricKind.Datetime && (
        <DateField
          name={variable.param}
          description={variable.description || ""}
          label={variable.label || variable.param}
        />
      )}
    </div>
  );
};

const defaultReducer = (
  acc: { [key: string]: string },
  role: EntityRoleDefinitionFragment | ReagentRoleDefinitionFragment,
) => {
  if (!role.currentDefault) {
    return acc;
  }
  acc[role.role] = role.currentDefault.id;
  return acc;
};

const variableReducer = (
  acc: { [key: string]: string },
  role: VariableDefinitionFragment,
) => {
  if (!role.default) {
    return acc;
  }
  acc[role.param] = role.default;
  return acc;
};

export default (props: {
  protocolEventCategory: ProtocolEventCategoryFragment;
  rolemap: { [key: string]: any };
}) => {
  const [add] = useRecordProtocolEventMutation();

  const dialog = useGraphQlFormDialog(add);

  const sourceEntityDefaults =
    props.protocolEventCategory.sourceEntityRoles.reduce(defaultReducer, {});
  const targetEntityDefaults =
    props.protocolEventCategory.targetEntityRoles.reduce(defaultReducer, {});
  const sourceReagentDefaults =
    props.protocolEventCategory.sourceReagentRoles.reduce(defaultReducer, {});
  const targetReagentDefaults =
    props.protocolEventCategory.targetReagentRoles.reduce(defaultReducer, {});
  const variableDefaults =
    props.protocolEventCategory.variableDefinitions.reduce(variableReducer, {});

  const form = useForm<{
    [key: string]: string;
  }>({
    defaultValues: {
      ...sourceEntityDefaults,
      ...targetEntityDefaults,
      ...sourceReagentDefaults,
      ...targetReagentDefaults,
      ...variableDefaults,
      ...props.rolemap,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            // Convert all values to strings

            dialog({
              variables: {
                input: {
                  category: props.protocolEventCategory.id,
                  reagentSources:
                    props.protocolEventCategory.sourceReagentRoles.map(
                      (role) => {
                        return {
                          key: role.role,
                          node: data[role.role],
                        };
                      },
                    ),
                  reagentTargets:
                    props.protocolEventCategory.targetReagentRoles.map(
                      (role) => {
                        return {
                          key: role.role,
                          node: data[role.role],
                        };
                      },
                    ),
                  entitySources:
                    props.protocolEventCategory.sourceEntityRoles.map(
                      (role) => {
                        return {
                          key: role.role,
                          node: data[role.role],
                        };
                      },
                    ),
                  entityTargets:
                    props.protocolEventCategory.targetEntityRoles.map(
                      (role) => {
                        return {
                          key: role.role,
                          node: data[role.role],
                        };
                      },
                    ),
                  variables:
                    props.protocolEventCategory.variableDefinitions.map((v) => {
                      return {
                        key: v.param,
                        value: data[v.param],
                      };
                    }),
                },
              },
            });
          })}
        >
          <h1 className="text-xl">{props.protocolEventCategory.label}</h1>

          <p className="py-6">{props.protocolEventCategory.description}</p>

          <div className="grid grid-cols-2 gap-2">
            {props.protocolEventCategory.sourceEntityRoles.map((role) => {
              return <EntityRoleInput key={role.role} role={role} />;
            })}
            {props.protocolEventCategory.targetEntityRoles.map((role) => {
              return <EntityRoleInput key={role.role} role={role} />;
            })}
            {props.protocolEventCategory.sourceReagentRoles.map((role) => {
              return <ReagentRoleInput key={role.role} role={role} />;
            })}
            {props.protocolEventCategory.targetReagentRoles.map((role) => {
              return <ReagentRoleInput key={role.role} role={role} />;
            })}

            {props.protocolEventCategory.variableDefinitions.map((v) => {
              return <VariableParamInput key={v.param} variable={v} />;
            })}
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
