/* eslint-disable react/react-in-jsx-scope */

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useAssignUserPermissionsMutation,
  useGetPermissionsQuery,
} from "@/mikro-next/api/graphql";
import { useFieldArray, useForm } from "react-hook-form";
import { PermissionAssignmentCard } from "./PermissionAssignmentCard";

type AssignForm = {
  assignments: {
    user: string;
    permission: string;
  }[];
};

export const ShareDialog = (props: { identifier: string; object: string }) => {
  const [assign] = useAssignUserPermissionsMutation();

  const form = useForm<AssignForm>({
    defaultValues: {
      assignments: [],
    },
  });

  const { data, refetch } = useGetPermissionsQuery({
    variables: { identifier: props.identifier, object: props.object },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assignments",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    for (const assignment of data.assignments) {
      await assign({
        variables: {
          input: {
            identifier: props.identifier,
            object: props.object,
            user: assignment.user,
            permissions: [assignment.permission],
          },
        },
        refetchQueries: ["GetPermissions"],
      });
    }

    form.reset({ assignments: [] });
    refetch();
  });

  return (
    <Form {...form}>
      {JSON.stringify(data?.permissions)}
      <h2 className="text-lg font-bold mb-4">Share this item</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <PermissionAssignmentCard
            key={field.id}
            index={index}
            identifier={props.identifier}
            remove={remove}
          />
        ))}

        <Button
          type="button"
          onClick={() => append({ user: "", permission: "" })}
        >
          Add Permission
        </Button>

        <Button type="submit">Assign Permissions</Button>
      </form>
    </Form>
  );
};
