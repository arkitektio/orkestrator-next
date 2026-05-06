import type {
  WorkerPoolTaskDescriptor,
  WorkerPoolTaskInput,
  WorkerPoolTaskOptions,
  WorkerPoolTask,
  WorkerPoolProgressCallback,
  WorkerPoolRunTasksResult,
  RunInfo,
} from './types'

type QueuedTask<T> = {
  infoIndex: number
  resultIndex: number
  task: WorkerPoolTask<T>
  priority: number
  sequence: number
}

/**
 * A pool of Web Workers that schedules tasks with bounded concurrency.
 *
 * Provides two usage patterns:
 *
 * 1. **ChunkQueue interface** — `add()` to enqueue individual tasks, then
 *    `await onIdle()` to wait for all of them to complete.
 *
 * 2. **Batch interface** — `runTasks()` to submit an array of tasks at once,
 *    with optional progress reporting and cancellation support.
 *
 * Ported from the itk-wasm `WebWorkerPool` implementation.
 */
export class WorkerPool {
  /** Available (idle) workers. Uses LIFO (push/pop) for warm reuse. */
  workerQueue: Array<Worker | null>

  /** Bookkeeping for each `runTasks` / `onIdle` invocation. */
  private runInfo: Array<RunInfo<unknown>>

  /** Globally scheduled tasks across all active runs. */
  private taskQueue: Array<QueuedTask<unknown>>

  /**
   * Accumulated tasks from `add()` calls, drained by the next `onIdle()`.
   * @internal
   */
  private pendingTasks: Array<WorkerPoolTaskDescriptor<unknown>>

  private nextSequence: number

  /**
   * @param poolSize - Maximum number of concurrent web workers.
   */
  constructor(poolSize: number) {
    this.workerQueue = new Array<Worker | null>(poolSize)
    this.workerQueue.fill(null)
    this.runInfo = []
    this.pendingTasks = []
    this.taskQueue = []
    this.nextSequence = 0
  }

  // ---------------------------------------------------------------------------
  // ChunkQueue-compatible interface
  // ---------------------------------------------------------------------------

  /**
   * Enqueue a single task for execution.
   *
   * The provided function receives an available `Worker` (or `null` when a new
   * worker should be created) and must return `{ worker, result }` so the pool
   * can recycle the worker.
   *
   * Tasks are not started until {@link onIdle} is called.
   *
   * @param fn - Task function.
   */
  add<T>(fn: WorkerPoolTask<T>, options?: WorkerPoolTaskOptions): void
  add<T>(taskInput: WorkerPoolTaskInput<T>, options?: WorkerPoolTaskOptions): void {
    this.pendingTasks.push(
      this.normalizeTaskInput(taskInput, options) as WorkerPoolTaskDescriptor<unknown>,
    )
  }

  /**
   * Execute all tasks previously enqueued via {@link add} and wait for them
   * to complete.
   *
   * @returns An array of results in the same order tasks were added.
   */
  async onIdle<T>(): Promise<T[]> {
    const tasks = this.pendingTasks.splice(0)
    if (tasks.length === 0) {
      return []
    }
    const { promise } = this.runTasks<unknown>(tasks as Array<WorkerPoolTaskInput<unknown>>)
    return promise as Promise<T[]>
  }

  // ---------------------------------------------------------------------------
  // Batch interface (itk-wasm style)
  // ---------------------------------------------------------------------------

  /**
   * Submit an array of tasks for execution.
   *
   * @param taskFns          - Array of task functions.
   * @param progressCallback - Optional callback invoked after each task
   *                           completes.
   * @returns An object with a `promise` that resolves with ordered results and
   *          a `runId` for cancellation.
   */
  runTasks<T>(
    taskFns: Array<WorkerPoolTaskInput<T>>,
    progressCallback: WorkerPoolProgressCallback | null = null
  ): WorkerPoolRunTasksResult<T> {
    const info: RunInfo<T> = {
      results: [],
      totalTasks: taskFns.length,
      queuedTasks: taskFns.length,
      runningWorkers: 0,
      index: 0,
      completedTasks: 0,
      progressCallback,
      canceled: false,
      settled: false,
    }
    this.runInfo.push(info as RunInfo<unknown>)
    info.index = this.runInfo.length - 1

    return {
      promise: new Promise<T[]>((resolve, reject) => {
        info.resolve = resolve
        info.reject = reject

        info.results = new Array<T>(taskFns.length)
        info.completedTasks = 0
        if (taskFns.length === 0) {
          info.settled = true
          resolve([])
          this.clearTask(info.index)
          return
        }

        taskFns.forEach((taskInput, index) => {
          this.enqueueTask<T>(info.index, index, taskInput)
        })

        this.pumpQueue()
      }),
      runId: info.index,
    }
  }

  /**
   * Terminate all idle workers in the pool. Workers currently executing tasks
   * are not affected — they will be replaced with `null` slots once they
   * complete.
   */
  terminateWorkers(): void {
    for (let i = 0; i < this.workerQueue.length; i++) {
      const worker = this.workerQueue[i]
      if (worker != null) {
        worker.terminate()
      }
      this.workerQueue[i] = null
    }
  }

  /**
   * Cancel a pending `runTasks` batch. The returned promise will reject with
   * `'Remaining tasks canceled'`.
   *
   * @param runId - The `runId` returned by {@link runTasks}.
   */
  cancel(runId: number): void {
    const info = this.runInfo[runId]
    if (info != null && !info.settled) {
      info.canceled = true
      this.removeQueuedTasks(runId)
      this.settleRun(runId)
    }
  }

  updatePriority(runId: number, resultIndex: number, priority: number): boolean {
    const queuedIndex = this.taskQueue.findIndex(
      (task) => task.infoIndex === runId && task.resultIndex === resultIndex,
    )

    if (queuedIndex === -1) {
      return false
    }

    const [queuedTask] = this.taskQueue.splice(queuedIndex, 1)
    queuedTask.priority = priority
    this.insertTask(queuedTask)
    return true
  }

  // ---------------------------------------------------------------------------
  // Internal scheduling — ported from itk-wasm
  // ---------------------------------------------------------------------------

  /**
   * Core scheduler. Three branches:
   *
   * 1. **Worker available** — pop it, run the task, recycle the worker on
   *    completion, then chain-schedule the next queued task.
   * 2. **No worker, but work in progress** — push onto the overflow queue;
   *    a completing worker will pick it up.
   * 3. **No worker, nothing in progress** — retry after a short delay (handles
   *    a race when multiple concurrent `runTasks` calls compete for workers).
   *
   * @internal
   */
  private enqueueTask<T>(
    infoIndex: number,
    resultIndex: number,
    taskInput: WorkerPoolTaskInput<T>,
  ): void {
    const descriptor = this.normalizeTaskInput(taskInput)
    this.insertTask({
      infoIndex,
      resultIndex,
      task: descriptor.task,
      priority: descriptor.priority ?? 0,
      sequence: this.nextSequence++,
    })
  }

  private pumpQueue(): void {
    while (this.workerQueue.length > 0 && this.taskQueue.length > 0) {
      const queuedTask = this.taskQueue.shift()!
      const info = this.runInfo[queuedTask.infoIndex]

      if (info == null || info.settled) {
        continue
      }

      if (info.canceled === true) {
        info.queuedTasks = Math.max(0, info.queuedTasks - 1)
        this.settleRun(queuedTask.infoIndex)
        continue
      }

      const worker = this.workerQueue.pop() as Worker | null
      info.queuedTasks = Math.max(0, info.queuedTasks - 1)
      info.runningWorkers++

      queuedTask
        .task(worker)
        .then(({ worker: returnedWorker, result }) => {
          this.workerQueue.push(returnedWorker)

          const activeInfo = this.runInfo[queuedTask.infoIndex]
          if (activeInfo != null && !activeInfo.settled) {
            activeInfo.runningWorkers--

            if (activeInfo.canceled !== true) {
              ;(activeInfo.results as Array<unknown>)[queuedTask.resultIndex] = result
              activeInfo.completedTasks++

              if (activeInfo.progressCallback != null) {
                activeInfo.progressCallback(
                  activeInfo.completedTasks,
                  activeInfo.totalTasks,
                )
              }
            }

            this.settleRun(queuedTask.infoIndex)
          }

          this.pumpQueue()
        })
        .catch((error: unknown) => {
          const failedInfo = this.runInfo[queuedTask.infoIndex]

          if (failedInfo != null && !failedInfo.settled) {
            failedInfo.runningWorkers--
            failedInfo.reject!(error)
            this.clearTask(failedInfo.index)
          }

          if (worker != null) {
            worker.terminate()
          }
          this.workerQueue.push(null)
          this.pumpQueue()
        })
    }
  }

  private normalizeTaskInput<T>(
    taskInput: WorkerPoolTaskInput<T>,
    options?: WorkerPoolTaskOptions,
  ): WorkerPoolTaskDescriptor<T> {
    if (typeof taskInput === 'function') {
      return { task: taskInput, priority: options?.priority }
    }

    return taskInput
  }

  private insertTask(task: QueuedTask<unknown>): void {
    const insertionIndex = this.taskQueue.findIndex((queuedTask) => {
      if (queuedTask.priority !== task.priority) {
        return queuedTask.priority < task.priority
      }

      return queuedTask.sequence > task.sequence
    })

    if (insertionIndex === -1) {
      this.taskQueue.push(task)
      return
    }

    this.taskQueue.splice(insertionIndex, 0, task)
  }

  private removeQueuedTasks(runId: number): void {
    let removedTasks = 0
    this.taskQueue = this.taskQueue.filter((task) => {
      const shouldRemove = task.infoIndex === runId
      if (shouldRemove) {
        removedTasks++
      }
      return !shouldRemove
    })

    const info = this.runInfo[runId]
    if (info != null) {
      info.queuedTasks = Math.max(0, info.queuedTasks - removedTasks)
    }
  }

  private settleRun(runId: number): void {
    const info = this.runInfo[runId]

    if (info == null || info.settled) {
      return
    }

    if (info.canceled === true) {
      if (info.runningWorkers === 0 && info.queuedTasks === 0) {
        info.settled = true
        info.reject!('Remaining tasks canceled')
        this.clearTask(runId)
      }
      return
    }

    if (info.completedTasks === info.totalTasks) {
      info.settled = true
      info.resolve!(info.results)
      this.clearTask(runId)
    }
  }

  /**
   * Clean up a completed/canceled run's bookkeeping without removing it from
   * the array (indices are used as run IDs).
   * @internal
   */
  private clearTask(clearIndex: number): void {
    const info = this.runInfo[clearIndex]
    this.removeQueuedTasks(clearIndex)
    info.results = []
    info.totalTasks = 0
    info.queuedTasks = 0
    info.progressCallback = null
    info.canceled = null
    info.runningWorkers = 0
    info.completedTasks = 0
    info.settled = true
    info.reject = () => {}
    info.resolve = () => {}
  }
}

export default WorkerPool
