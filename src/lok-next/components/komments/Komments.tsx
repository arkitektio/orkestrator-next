
import { withLokNext } from "@jhnnsrs/lok-next";
import { KommentProps } from "./types";
import { CommentsForDocument, CommentsForQuery, useCommentsForQuery, useCreateCommentMutation, useReplyToMutation } from "@/lok-next/api/graphql";
import { CommentEdit } from "./edit/CommentEdit";
import { CommentList } from "./display/CommentList";

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
        }
      );
    },
  });

  return (
    <div className="flex flex-col ">
      <CommentEdit
        identifier={identifier}
        object={object}
        createComment={createComment}
      />
      {data?.commentsFor && (
        <CommentList
          comments={data?.commentsFor}
        />
      )}
    </div>
  );
};
