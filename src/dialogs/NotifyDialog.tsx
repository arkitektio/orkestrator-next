import { useDialog } from "@/app/dialog";
import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import {  DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useNotifyUserMutation } from "@/lok-next/api/graphql";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type NotifyFormData = {
  title: string;
  message: string;
};

export const NotifyDialog = (props: { users: string[] }) => {
  const [notify] = useNotifyUserMutation();

  const { closeDialog } = useDialog();

  const dialog = async (data: NotifyFormData) => {
    const { title, message } = data;

    // Send notification to each user
    const promises = props.users.map(userId =>
      notify({
        variables: {
          input: {
            user: userId,
            title,
            message,
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

  const form = useForm<NotifyFormData>({
    defaultValues: {
      title: "You better run",
      message: "Or you hide!!",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(dialog
        )}
      >
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="text-sm text-muted-foreground">
            Sending notification to {props.users.length} user{props.users.length > 1 ? 's' : ''}
          </div>
          
          <StringField
            name="title"
            label="Notification Title"
            description="A brief title for your notification"
            placeholder="Enter notification title..."
          />
          
          <ParagraphField
            name="message"
            label="Message"
            description="The main content of your notification"
            placeholder="Enter your message here..."
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

