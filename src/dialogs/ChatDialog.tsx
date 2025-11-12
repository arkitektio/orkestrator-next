import { useDialog } from "@/app/dialog";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useChatMutation, Role } from "@/alpaka/api/graphql";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

type ChatFormData = {
    message: string;
};

export const ChatDialog = (props: { model: string }) => {
    const [chat, { loading }] = useChatMutation();
    const [response, setResponse] = useState<string | null>(null);

    const { closeDialog } = useDialog();

    const handleChat = async (data: ChatFormData) => {
        try {
            const result = await chat({
                variables: {
                    input: {
                        model: props.model,
                        messages: [
                            {
                                role: Role.User,
                                content: data.message,
                            },
                        ],
                    },
                },
            });

            if (result.data?.chat?.choices?.[0]?.message?.content) {
                setResponse(result.data.chat.choices[0].message.content);
                toast.success("Chat response received");
            } else {
                toast.error("No response received");
            }
        } catch (error) {
            toast.error("Failed to chat with model");
            console.error(error);
        }
    };

    const form = useForm<ChatFormData>({
        defaultValues: {
            message: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleChat)}>
                <DialogHeader>
                    <DialogTitle>Chat with Model</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <ParagraphField
                        name="message"
                        label="Your Message"
                        description="Enter your message to send to the model"
                        placeholder="Ask me anything..."
                    />

                    {response && (
                        <div className="mt-4 p-4 bg-muted rounded-md">
                            <h4 className="text-sm font-semibold mb-2">Response:</h4>
                            <p className="text-sm whitespace-pre-wrap">{response}</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeDialog}
                        disabled={loading}
                    >
                        Close
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};
