import { AssignationEventKind } from '@/rekuest/api/graphql'

/**
 * Tailwind classes for a status bar/badge keyed by an assignation's
 * `latestEventKind`. Shared by the timeline bars and the live status strip so
 * the two surfaces speak the same colour language.
 */
export const getStatusColor = (status: AssignationEventKind | undefined | string) => {
  switch (status) {
    case AssignationEventKind.Done:
      return 'bg-primary/20 border-primary'
    case AssignationEventKind.Yield:
      return 'bg-violet-400/90 border-violet-500'
    case AssignationEventKind.Error:
      return 'bg-rose-400/90 border-rose-500'
    case AssignationEventKind.Critical:
      return 'bg-rose-400/90 border-rose-500'
    case AssignationEventKind.Cancelled:
      return 'bg-zinc-500/80 border-zinc-600'
    default:
      return 'bg-primary/70 border-primary'
  }
}

export type ChildStatusBucket = 'running' | 'done' | 'errored' | 'cancelled'

/**
 * Buckets an assignation into a coarse lifecycle status for at-a-glance counts.
 * Anything not yet terminal counts as "running".
 */
export const classifyChild = (child: {
  isDone?: boolean | null
  latestEventKind?: AssignationEventKind | null
}): ChildStatusBucket => {
  switch (child.latestEventKind) {
    case AssignationEventKind.Error:
    case AssignationEventKind.Critical:
      return 'errored'
    case AssignationEventKind.Cancelled:
    case AssignationEventKind.Interupted:
      return 'cancelled'
    case AssignationEventKind.Done:
      return 'done'
    default:
      return child.isDone ? 'done' : 'running'
  }
}
