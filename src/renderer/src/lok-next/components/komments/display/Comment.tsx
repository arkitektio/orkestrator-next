import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokUser } from "@/linkers";
import { Reply, X } from "lucide-react";
import { useState } from "react";
import Timestamp from "react-timestamp";
import { CommentEdit } from "../edit/CommentEdit";
import { DescendantType, LeafType, ListCommentType } from "../types";
import { Mention } from "./Mention";

export const renderLeaf = (x: LeafType) => {
  if (x.italic) {
    return <i>{x.text}</i>;
  }
  if (x.bold) {
    return <b>{x.text}</b>;
  }
  if (x.code) {
    return (
      <code className="bg-back-900 text-xs p-1 rounded-md text-white my-auto">
        {x.text}
      </code>
    );
  }

  return x?.text;
};

export const renderDescendant = (x: DescendantType) => {
  if (!x) return <>Weird</>;

  switch (x.__typename) {
    case "LeafDescendant":
      return renderLeaf(x);
    case "MentionDescendant":
      return <Mention element={x} />;
    case "ParagraphDescendant":
      return <p>{x.children?.map(renderDescendant)}</p>;
    default:
      return <span> Error</span>;
  }
};

export const Comment = ({ comment }: { comment: ListCommentType }) => {
  const [showReply, setShowReply] = useState(false);
  const s3resolve = useResolve();

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group w-full">
      <div className="flex-shrink-0 mt-1">
        <LokUser.DetailLink object={comment?.user?.id}>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={
                comment?.user?.profile.avatar?.presignedUrl
                  ? s3resolve(comment?.user?.profile.avatar?.presignedUrl)
                  : ``
              }
              alt={comment?.user?.username}
            />
            <AvatarFallback>
              {comment?.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </LokUser.DetailLink>
      </div>

      <div className="flex flex-col flex-grow min-w-0">


        <Card className="mb-2 border-border/50">
          <CardContent className="p-3 text-sm">
            {comment?.descendants?.map(renderDescendant)}
          </CardContent>
        </Card>

        <div className="flex h-7">
          <div className="flex-1 flex items-center gap-2">
          <LokUser.DetailLink object={comment?.user?.id}>
            <span className="font-light text-sm hover:underline">
              {comment?.user?.username}
            </span>
          </LokUser.DetailLink>
          {comment?.createdAt && (
            <Timestamp
              date={comment?.createdAt}
              relative
              className="text-xs text-muted-foreground my-auto ml-2"
            />
          )}
          </div>

        <div className="flex items-center gap-2 group-hover:block hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReply(!showReply)}
            className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>
        </div>


        {comment?.children && comment.children.length > 0 && (
          <div className="mt-3 space-y-3 pl-2 border-l-2 border-border/50">
            {comment.children.map((reply, index) => (
              <div key={index} className="flex gap-2">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage
                    src={
                      reply?.user?.profile.avatar?.presignedUrl
                        ? s3resolve(reply?.user?.profile.avatar?.presignedUrl)
                        : `https://eu.ui-avatars.com/api/?name=${reply?.user?.username}&background=random`
                    }
                    alt={reply?.user?.username}
                  />
                  <AvatarFallback className="text-xs">
                    {reply?.user?.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs">
                      {reply?.user?.username}
                    </span>
                    {reply?.createdAt && (
                      <Timestamp
                        date={reply?.createdAt}
                        relative
                        className="text-xs text-muted-foreground"
                      />
                    )}
                  </div>
                  <Card className="border-border/50">
                    <CardContent className="p-2 text-xs">
                      {reply?.descendants?.map(renderDescendant)}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}

        {showReply && (
          <div className="mt-3 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReply(false)}
              className="h-7 w-7 p-0 flex-shrink-0 my-auto"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex-1">
                <CommentEdit parent={comment?.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
