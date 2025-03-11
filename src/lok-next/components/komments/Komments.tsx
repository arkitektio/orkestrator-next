import { Card } from "@/components/ui/card";
import {
  CommentsForDocument,
  CommentsForQuery,
  useCommentsForQuery,
  useCreateCommentMutation,
} from "@/lok-next/api/graphql";
import { CommentList } from "./display/CommentList";
import { CommentEdit } from "./edit/CommentEdit";
import { KommentProps } from "./types";

export const Komments = ({ identifier, object }: KommentProps) => {
  const { data } = useCommentsForQuery({
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
