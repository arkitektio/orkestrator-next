import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLiveTask, useTask } from "@/rekuest/hooks/useTasks";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  dismiss,
  useTaskNotifications,
} from "../../lib/taskNotifications";
import { TaskStatusLine } from "../task/TaskStatusLine";
import { TaskStatusIcon } from "../hovers/status";
import {
  borderColorForAss,
  DynamicYieldDisplay,
} from "../functional/TaskUpdater";

/**
 * A single live task notification card. Ported from the former sonner
 * `TaskToast` — same content (status line, error block, yield display) and the
 * same auto-dismiss behavior, but rendered inside our own animated stack so we
 * own the layout (no sonner height re-measuring).
 */
const TaskNotificationCard = ({ id }: { id: string }) => {
  const task = useTask({ task: id });
  const live = useLiveTask({ task: id });

  // Success and cancellation auto-dismiss after a delay long enough to read the
  // result. Errors AND tasks that yielded a result (e.g. an image) persist
  // until closed via the X button, so the result stays visible to inspect.
  useEffect(() => {
    if ((live.done || live.cancelled) && !live.yield && !live.error) {
      const timer = setTimeout(() => dismiss(id), 8000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [live.done, live.cancelled, live.yield, live.error, id]);

  if (!task) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative flex w-80 flex-col gap-2 rounded-md border bg-background p-3 shadow-lg",
        borderColorForAss(live),
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={() => dismiss(id)}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="pr-7">
        <TaskStatusLine task={task} showCancel showLink />
      </div>

      {live.error && (
        <div className="w-full rounded bg-red-500/10 p-2 text-xs text-red-500">
          {live.error}
        </div>
      )}

      {live.yield && live.actionId && (
        <DynamicYieldDisplay values={live.yield} actionId={live.actionId} />
      )}
    </div>
  );
};

/**
 * Compact collapsed trigger: a small pill summarizing the latest task (icon,
 * name, progress) plus a `+N` count. Hovering / clicking it expands the full
 * stack. Re-keyed on the newest id so it pops when a fresh task arrives.
 */
const TaskNotificationPill = ({
  id,
  count,
  onClick,
}: {
  id: string;
  count: number;
  onClick: () => void;
}) => {
  const task = useTask({ task: id });
  const live = useLiveTask({ task: id });

  if (!task) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Show tasks"
      className={cn(
        "flex max-w-[18rem] items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 shadow-lg backdrop-blur transition-colors hover:bg-accent",
        borderColorForAss(live),
      )}
    >
      <TaskStatusIcon
        kind={task.latestEventKind}
        isDone={task.isDone}
        className="h-4 w-4 shrink-0"
      />
      <span className="min-w-0 flex-1 truncate text-xs font-medium">
        {live.actionName || "Unknown action"}
      </span>
      {live.progress != null && (
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {live.progress}%
        </span>
      )}
      {count > 1 && (
        <span className="shrink-0 rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          +{count - 1}
        </span>
      )}
    </button>
  );
};

const ENTER = { opacity: 0, y: 15, scale: 0.96 };
const SHOWN = { opacity: 1, y: 0, scale: 1 };
const LEAVE = { opacity: 0, y: -10, scale: 0.95 };
const SPRING = { type: "spring", bounce: 0.3, duration: 0.35 } as const;

/**
 * Global, animated notification stack for current tasks. Anchored bottom-center.
 *
 * Collapsed (default): a small pill summarizing the latest task. Hovering /
 * focusing / clicking it fans every active task out into a full column above.
 *
 * Reads its ids from the `taskNotifications` store, which `TaskUpdater` feeds
 * from the WatchMyTasks subscription — so a fresh task still pops in on create,
 * exactly like the old toast.
 */
export const TaskNotificationStack = () => {
  const ids = useTaskNotifications();
  const [expanded, setExpanded] = useState(false);

  if (ids.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={() => setExpanded(false)}
    >
      <AnimatePresence initial={false}>
        {expanded &&
          ids.map((id) => (
            <motion.div
              key={id}
              layout
              initial={ENTER}
              animate={SHOWN}
              exit={LEAVE}
              transition={SPRING}
            >
              <TaskNotificationCard id={id} />
            </motion.div>
          ))}
      </AnimatePresence>

      {!expanded && (
        <motion.div
          key={ids[0]}
          layout
          initial={ENTER}
          animate={SHOWN}
          transition={SPRING}
        >
          <TaskNotificationPill
            id={ids[0]}
            count={ids.length}
            onClick={() => setExpanded(true)}
          />
        </motion.div>
      )}
    </div>
  );
};
