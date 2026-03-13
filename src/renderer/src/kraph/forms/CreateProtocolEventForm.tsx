import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { DateField } from "@/components/fields/DateField";
import { DateTimeField } from "@/components/fields/DateTimeField";
import { FloatField } from "@/components/fields/FloatField";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { IntField } from "@/components/fields/IntField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useUserOptionsLazyQuery } from "@/lok-next/api/graphql";
import { useForm } from "react-hook-form";


export const EntityRoleInput = ({
  role,
}: {
  role: Role;
}) => {
  const [search] = useSearchEntitiesForRoleLazyQuery({
    variables: {
      tags: role?.categoryDefinition?.tagFilters?.map((tag) => tag) || [],
      categories:
        role?.categoryDefinition?.categoryFilters?.map((cat) => cat) || [],
    },
    nextFetchPolicy: "cache-and-network",
  });

  const [createEntity] = useCreateEntityInlineMutation({})







  return (
    <div key={role.role} className="col-span-2 flex-col gap-1 flex">
      {role.allowMultiple ? (
        <GraphQLListSearchField
          searchQuery={search}
          name={"map." + role.role}
          description={role.description || ""}
          label={role.label || role.role}
          createComponent={<> Create new </>}
        />
      ) : (
        <GraphQLCreatableSearchField
          name={"map." + role.role}
          searchQuery={search}
          description={role.description || ""}
          label={role.label || role.role}
          createMutation={(req) => createEntity({ variables: { input: req.variables.input, category: role.createCategory?.id } })}
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
          name={"map." + role.role}
          label={role.label || role.role}
          description={role.description || ""}
        />
      ) : (
        <GraphQLSearchField
          name={"map." + role.role}
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
      {variable.valueKind === ValueKind.String && (
        <StringField
          name={"map." + variable.param}
          description={variable.description || ""}
          label={variable.label || variable.param}
        />
      )}
      {variable.valueKind === ValueKind.Int && (
        <IntField
          name={"map." + variable.param}
          description={variable.description || ""}
          label={variable.label || variable.param}
        />
      )}
      {variable.valueKind === ValueKind.Float && (
        <FloatField
          name={"map." + variable.param}
          description={variable.description || ""}
          label={variable.label || variable.param}
        />
      )}
      {variable.valueKind === ValueKind.Datetime && (
        <DateField
          name={"map." + variable.param}
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

  const [searchUser] = useUserOptionsLazyQuery();

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
    map: { [key: string]: string };
    validFrom: Date | null;
    validTo: Date | null;
    performedBy: string | null;
  }>({
    defaultValues: {
      map: {
        ...sourceEntityDefaults,
        ...targetEntityDefaults,
        ...sourceReagentDefaults,
        ...targetReagentDefaults,
        ...variableDefaults,
        ...props.rolemap,
      },
      validFrom: new Date(),
      validTo: new Date(),
      performedBy: null
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
                          node: data.map[role.role],
                        };
                      },
                    ),
                  reagentTargets:
                    props.protocolEventCategory.targetReagentRoles.map(
                      (role) => {
                        return {
                          key: role.role,
                          node: data.map[role.role],
                        };
                      },
                    ),
                  entitySources:
                    props.protocolEventCategory.sourceEntityRoles.map(
                      (role) => {
                        return {
                          key: role.role,
                          node: data.map[role.role],
                        };
                      },
                    ),
                  entityTargets:
                    props.protocolEventCategory.targetEntityRoles.map(
                      (role) => {
                        return {
                          key: role.role,
                          node: data.map[role.role],
                        };
                      },
                    ),
                  variables:
                    props.protocolEventCategory.variableDefinitions.map((v) => {
                      return {
                        key: v.param,
                        value: data.map[v.param],
                      };
                    }),
                  validFrom: data.validFrom,
                  validTo: data.validTo,
                  performedBy: data.performedBy,
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
          <Separator className="my-4" />

          <div className="flex flex-col gap-2 mt-4">
            <DateTimeField
              name="validFrom"
              label="Valid From"
              description="The date and time when the protocol was started"
            />
            <DateTimeField
              name="validTo"
              label="Valid To"
              description="The date and time when the protocol event ended"
            />

            <GraphQLSearchField
              name="performedBy"
              searchQuery={searchUser}
              label="Performed By"
              description="The user that performed the protocol event."
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

