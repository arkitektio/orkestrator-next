import { TaskEventKind } from '@/rekuest/api/graphql'

/**
 * Tailwind classes for a status bar/badge keyed by an task's
 * `latestEventKind`. Shared by the timeline bars and the live status strip so
 * the two surfaces speak the same colour language.
 */
export const getStatusColor = (status: TaskEventKind | undefined | string) => {
  switch (status) {
    case TaskEventKind.Completed:
      return 'bg-primary/20 border-primary'
    case TaskEventKind.Yield:
      return 'bg-violet-400/90 border-violet-500'
    case TaskEventKind.Failed:
      return 'bg-rose-400/90 border-rose-500'
    case TaskEventKind.Critical:
      return 'bg-rose-400/90 border-rose-500'
    case TaskEventKind.Cancelled:
      return 'bg-zinc-500/80 border-zinc-600'
    default:
      return 'bg-primary/70 border-primary'
  }
}

export type ChildStatusBucket = 'running' | 'done' | 'errored' | 'cancelled'

/**
 * Buckets an task into a coarse lifecycle status for at-a-glance counts.
 * Anything not yet terminal counts as "running".
 */
export const classifyChild = (child: {
  isDone?: boolean | null
  latestEventKind?: TaskEventKind | null
}): ChildStatusBucket => {
  switch (child.latestEventKind) {
    case TaskEventKind.Failed:
    case TaskEventKind.Critical:
      return 'errored'
    case TaskEventKind.Cancelled:
    case TaskEventKind.Interrupted:
      return 'cancelled'
    case TaskEventKind.Completed:
      return 'done'
    default:
      return child.isDone ? 'done' : 'running'
  }
}
