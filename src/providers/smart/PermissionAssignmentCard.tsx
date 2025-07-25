import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import {
  useUserOptionsLazyQuery,
  UserOptionsQuery,
} from "@/lok-next/api/graphql";
import {
  usePermissionOptionsLazyQuery,
  PermissionOptionsQuery,
} from "@/mikro-next/api/graphql";
import { useCallback } from "react";

type Props = {
  index: number;
  identifier: string;
  remove: (index: number) => void;
};

export const PermissionAssignmentCard = ({
  index,
  identifier,
  remove,
}: Props) => {
  const [searchUsers] = useUserOptionsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [searchPermissionsBase] = usePermissionOptionsLazyQuery();

  const searchPermissions = useCallback(
    (x: any) =>
      searchPermissionsBase({
        variables: {
          ...x.variables,
          identifier,
        },
      }),
    [searchPermissionsBase, identifier],
  );

  return (
    <Card className="p-2 flex flex-col gap-2">
      <GraphQLSearchField<UserOptionsQuery>
        searchQuery={searchUsers}
        label="User"
        placeholder="Search for a user"
        name={`assignments.${index}.user`}
      />
      <GraphQLSearchField<PermissionOptionsQuery>
        searchQuery={searchPermissions}
        label="Permission"
        placeholder="Search for a permission"
        name={`assignments.${index}.permission`}
      />
      <Button type="button" variant="outline" onClick={() => remove(index)}>
        Remove
      </Button>
    </Card>
  );
};
