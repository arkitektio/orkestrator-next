import { useDialog } from "@/app/dialog";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import {  DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useAddUserToOrganizationMutation, useOrganizationOptionsLazyQuery, useOrganizationOptionsQuery, useRoleOptionsLazyQuery } from "@/lok-next/api/graphql";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AddUserInfoForm = {
  roles: string[];
  organization: string;
};

export const AddUserToOrganizationDialog = (props: { users: string[], organization?: string }) => {
  const [add] = useAddUserToOrganizationMutation();
  const [search] = useRoleOptionsLazyQuery();
  const [searchOrg] = useOrganizationOptionsLazyQuery();

  const { closeDialog } = useDialog();

  const dialog = async (data: AddUserInfoForm) => {
    const { roles, organization } = data;

    // Send notification to each user
    const promises = props.users.map(userId =>
      add({
        variables: {
          input: {
            user: userId,
            organization: organization,
            roles: roles,
          },
        },
      })
    );
    
    try {
      await Promise.all(promises);
      toast.success(`Notification sent to ${props.users.length} user${props.users.length > 1 ? 's' : ''}`);
      return { data: { success: true } };
    } catch (error) {
      toast.error("Failed to send notifications");
      throw error;
    } finally {
      closeDialog();
    }
  }

  const form = useForm<AddUserInfoForm>({
    defaultValues: {
      organization: props.organization,
      roles: [],
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(dialog)}
      >
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="text-sm text-muted-foreground">
            Sending notification to {props.users.length} user{props.users.length > 1 ? 's' : ''}
          </div>
          
          {!props.organization && (
            <GraphQLSearchField
              name="organization"
              label="Organization"
              description="Select organization for the user"
              searchQuery={searchOrg}
            />
          )}
          <GraphQLListSearchField
            name="roles"
            label="Roles"
            description="Select roles for the user"
            searchQuery={search}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Sending..." : "Send Notification"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

