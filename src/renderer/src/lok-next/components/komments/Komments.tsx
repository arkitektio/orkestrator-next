import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CommentsForDocument,
  CommentsForQuery,
  useCommentsForQuery,
  useCreateCommentMutation,
} from "@/lok-next/api/graphql";
import { MessageSquare } from "lucide-react";
import { CommentList } from "./display/CommentList";
import { CommentEdit } from "./edit/CommentEdit";
import { KommentProps } from "./types";

export const Komments = ({ identifier, object }: KommentProps) => {
  const { data, error } = useCommentsForQuery({
    variables: { identifier, object },
  });

  const [createComment] = useCreateCommentMutation({
    update(cache, result) {
      cache.updateQuery<CommentsForQuery>(
        {
          query: CommentsForDocument,
          variables: {
            identifier,
            object,
          },
        },
        (data) => {
          if (!data) return data;
          return {
            ...data,
            commentsFor:
              result.data?.createComment && data?.commentsFor
                ? [result.data.createComment, ...data.commentsFor]
                : data?.commentsFor || [],
          };
        },
      );
    },
  });

  return (
    <div className="flex flex-col h-full">
        <div className="">
          <CommentEdit
            identifier={identifier}
            object={object}
            createComment={createComment}
          />
        </div>
        {error && (
          <div className="px-4">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load comments: {error.message}
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="flex-1 px-4 pb-4">
          {data?.commentsFor && <CommentList comments={data?.commentsFor} />}
        </div>
      </div>

  );
};
