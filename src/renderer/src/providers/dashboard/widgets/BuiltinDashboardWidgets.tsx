import { useRegisterDashboardWidget } from "../hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyActiveMessagesQuery,
  useMyMentionsQuery,
  useUsersQuery,
} from "@/lok-next/api/graphql";
import { Bell, MessageSquare, Users } from "lucide-react";

// ── Helpers ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractTextFromDescendants = (descendants: any[]): string => {
  if (!descendants) return "";
  return descendants
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((d: any) => {
      if (d.text) return d.text;
      if (d.children) return extractTextFromDescendants(d.children);
      if (d.user) return `@${d.user.username}`;
      return "";
    })
    .join("");
};

// ── Notifications widget ──

const NotificationsWidget = () => {
  const { data: messagesData } = useMyActiveMessagesQuery({
    fetchPolicy: "cache-and-network",
  });
  const { data: mentionsData } = useMyMentionsQuery({
    fetchPolicy: "cache-and-network",
  });

  const messages = messagesData?.myActiveMessages ?? [];
  const mentions = mentionsData?.myMentions ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-2 rounded-lg bg-muted/50 space-y-0.5"
          >
            <p className="text-xs font-medium">{msg.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {msg.message}
            </p>
          </div>
        ))}
        {mentions.slice(0, 5).map((mention) => (
          <div
            key={mention.id}
            className="p-2 rounded-lg bg-muted/50 flex items-start gap-2"
          >
            <MessageSquare className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {mention.user.username}
                </span>{" "}
                mentioned you
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {extractTextFromDescendants(mention.descendants)}
              </p>
            </div>
          </div>
        ))}
        {messages.length === 0 && mentions.length === 0 && (
          <p className="text-xs text-muted-foreground">No new notifications</p>
        )}
      </div>
    </div>
  );
};

// ── Team widget ──

const TeamWidget = () => {
  const { data, loading } = useUsersQuery({
    variables: { pagination: { limit: 8 } },
    fetchPolicy: "cache-and-network",
  });

  const users = data?.users ?? [];

  return (
    <div className="flex flex-col h-full">
      {loading ? (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-8 h-8 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col items-center gap-1">
              <Avatar size="sm">
                {user.profile?.avatar?.presignedUrl ? (
                  <AvatarImage src={user.profile.avatar.presignedUrl} />
                ) : null}
                <AvatarFallback>
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] text-muted-foreground truncate max-w-[48px]">
                {user.username}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Registration component ──

export const BuiltinDashboardWidgets = () => {
  useRegisterDashboardWidget({
    key: "notifications",
    label: "Notifications",
    module: "lok",
    icon: <Bell className="w-3 h-3" />,
    component: () => <NotificationsWidget />,
    defaultSize: "1x2",
    defaultWidth: 25,
    defaultHeight: 100,
  });

  useRegisterDashboardWidget({
    key: "team",
    label: "Team",
    module: "lok",
    icon: <Users className="w-3 h-3 text-primary/40" />,
    component: () => <TeamWidget />,
    defaultSize: "1x2",
    defaultWidth: 25,
    defaultHeight: 100,
  });

  return null;
};
