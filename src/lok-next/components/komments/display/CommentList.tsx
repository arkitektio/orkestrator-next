import { ScrollArea } from "@/components/ui/scroll-area";
import { ListCommentType } from "../types";
import { Comment } from "./Comment";

export const CommentList: React.FunctionComponent<{
  comments?: ListCommentType[];
}> = ({ comments }) => {
  return (
    <>
      <ScrollArea className="mt-4 text-foreground flex flex-col gap-3">
        {comments && comments.length > 0 ? (
          <>
            <div className="flex flex-row text-md text-muted-foreground">
              Latest Comments
            </div>
            {comments.map((comment, index) => (
              <Comment comment={comment} key={index} />
            ))}
          </>
        ) : (
          <div className="flex flex-row justify-center text-center font-light text-md">
            No Comments yet
          </div>
        )}
      </ScrollArea>
    </>
  );
};
