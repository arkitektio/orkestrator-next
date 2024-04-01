import { withLokNext } from "@jhnnsrs/lok-next";
import { KommentProps } from "./types";
import {
  CommentsForDocument,
  CommentsForQuery,
  useCommentsForQuery,
  useCreateCommentMutation,
  useReplyToMutation,
} from "@/lok-next/api/graphql";
import { CommentEdit } from "./edit/CommentEdit";
import { CommentList } from "./display/CommentList";
import { Card } from "@/components/ui/card";

export const Komments = ({ identifier, object }: KommentProps) => {
  const { data } = withLokNext(useCommentsForQuery)({
    variables: { identifier, object },
  });

  const [createComment] = withLokNext(useCreateCommentMutation)({
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
          return {
            ...data,
            commentsFor:
              result.data?.createComment && data?.commentsFor
                ? [result.data.createComment, ...data?.commentsFor]
                : data?.commentsFor,
          };
        },
      );
    },
  });

  return (
    <div className="flex flex-col ">
      <div className="h-16 px-3 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-foreground ">Comments</h2>
      </div>
      <div className="flex-grow flex flex-col gap-2 p-3 direct @container">
      <Card>
      <CommentEdit
        identifier={identifier}
        object={object}
        createComment={createComment}
      />
      </Card>
      {data?.commentsFor && <CommentList comments={data?.commentsFor} />}
      </div>
    </div>
  );
};
