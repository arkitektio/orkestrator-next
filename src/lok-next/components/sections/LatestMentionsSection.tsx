import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LokComment } from "@/linkers";
import { useMyMentionsQuery } from "@/lok-next/api/graphql";
import { formatDistanceToNow } from "date-fns";
import { Clock, MessageSquare, User } from "lucide-react";
import { Comment } from "../komments/display/Comment";

export const LatestMentionsSection = () => {
  const { data, loading } = useMyMentionsQuery();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Latest Mentions</CardTitle>
          </div>
          <CardDescription>Recent mentions and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.myMentions || data.myMentions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Latest Mentions</CardTitle>
          </div>
          <CardDescription>Recent mentions and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p>No mentions yet</p>
            <p className="text-xs mt-1">You&apos;ll see mentions here when others tag you</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Latest Mentions</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {data.myMentions.length} mention{data.myMentions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <CardDescription>Recent mentions and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.myMentions.slice(0, 5).map((mention) => (
          <div
            key={mention.id}
            className="flex space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <LokComment.DetailLink
                object={mention.id}
                className="block hover:text-foreground"
              >
                <div className="mb-2">
                  <Comment comment={mention} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(mention.createdAt), { addSuffix: true })}</span>
                  </span>
                  <span>#{mention.id.slice(-8)}</span>
                </div>
              </LokComment.DetailLink>
            </div>
          </div>
        ))}

        {data.myMentions.length > 5 && (
          <div className="text-center pt-4 border-t">
            <LokComment.ListLink className="text-sm text-muted-foreground hover:text-foreground">
              View all {data.myMentions.length} mentions →
            </LokComment.ListLink>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
