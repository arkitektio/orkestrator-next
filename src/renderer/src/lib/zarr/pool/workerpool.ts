import type {
  WorkerPoolTaskDescriptor,
  WorkerPoolTaskHandle,
  WorkerPoolTaskInput,
  WorkerPoolTaskOptions,
} from './types'

type QueuedTask<T> = WorkerPoolTaskDescriptor<T> & {
  id: number
  sequence: number
  started: boolean
  settled: boolean
  canceled: boolean
  resolve: (result: T) => void
  reject: (error: unknown) => void
}

function createCanceledError(): Error {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('Aborted', 'AbortError')
  }

  const error = new Error('Aborted')
  error.name = 'AbortError'
  return error
}

export class WorkerPool {
  workerQueue: Array<Worker | null>

  private taskQueue: Array<QueuedTask<unknown>>

  private tasks: Map<number, QueuedTask<unknown>>

  private nextTaskId: number

  private nextSequence: number

  constructor(poolSize: number) {
    this.workerQueue = new Array<Worker | null>(poolSize)
    this.workerQueue.fill(null)
    this.taskQueue = []
    this.tasks = new Map()
    this.nextTaskId = 0
    this.nextSequence = 0
  }

  enqueue<T>(
    taskInput: WorkerPoolTaskInput<T>,
    options?: WorkerPoolTaskOptions,
  ): WorkerPoolTaskHandle<T> {
    const descriptor = this.normalizeTaskInput(taskInput, options)
    const id = this.nextTaskId++

    let resolve!: (result: T) => void
    let reject!: (error: unknown) => void
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise
      reject = rejectPromise
    })

    const queuedTask: QueuedTask<T> = {
      ...descriptor,
      id,
      sequence: this.nextSequence++,
      started: false,
      settled: false,
      canceled: false,
      resolve,
      reject,
    }

    this.tasks.set(id, queuedTask as QueuedTask<unknown>)
    this.insertTask(queuedTask as QueuedTask<unknown>)
    this.pumpQueue()

    return {
      id,
      promise,
      cancel: () => this.cancel(id),
      updatePriority: (priority) => this.updatePriority(id, priority),
    }
  }

  cancel(taskId: number): boolean {
    const task = this.tasks.get(taskId)
    if (!task || task.settled) {
      return false
    }

    task.canceled = true

    if (!task.started) {
      this.removeQueuedTask(taskId)
      this.rejectTask(task, createCanceledError())
      this.pumpQueue()
    }

    return true
  }

  updatePriority(taskId: number, priority: number): boolean {
    const task = this.tasks.get(taskId)
    if (!task || task.settled || task.started) {
      return false
    }

    const removed = this.removeQueuedTask(taskId)
    if (!removed) {
      return false
    }

    task.priority = priority
    this.insertTask(task)
    this.pumpQueue()
    return true
  }

  terminateWorkers(): void {
    for (let i = 0; i < this.workerQueue.length; i++) {
      const worker = this.workerQueue[i]
      if (worker != null) {
        worker.terminate()
      }
      this.workerQueue[i] = null
    }
  }

  private pumpQueue(): void {
    while (this.workerQueue.length > 0 && this.taskQueue.length > 0) {
      const queuedTask = this.taskQueue.shift()!

      if (queuedTask.settled) {
        continue
      }

      if (queuedTask.canceled) {
        this.rejectTask(queuedTask, createCanceledError())
        continue
      }

      const worker = this.workerQueue.pop() ?? null
      queuedTask.started = true

      queuedTask.task(worker)
        .then(({ worker: returnedWorker, result }) => {
          this.workerQueue.push(returnedWorker ?? null)

          if (queuedTask.canceled) {
            this.rejectTask(queuedTask, createCanceledError())
          } else {
            this.resolveTask(queuedTask, result)
          }

          this.pumpQueue()
        })
        .catch((error: unknown) => {
          this.workerQueue.push(null)
          this.rejectTask(
            queuedTask,
            queuedTask.canceled ? createCanceledError() : error,
          )
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
      if ((queuedTask.priority ?? 0) !== (task.priority ?? 0)) {
        return (queuedTask.priority ?? 0) < (task.priority ?? 0)
      }

      return queuedTask.sequence > task.sequence
    })

    if (insertionIndex === -1) {
      this.taskQueue.push(task)
      return
    }

    this.taskQueue.splice(insertionIndex, 0, task)
  }

  private removeQueuedTask(taskId: number): boolean {
    const index = this.taskQueue.findIndex((task) => task.id === taskId)
    if (index === -1) {
      return false
    }

    this.taskQueue.splice(index, 1)
    return true
  }

  private resolveTask<T>(task: QueuedTask<T>, result: T): void {
    if (task.settled) {
      return
    }

    task.settled = true
    this.tasks.delete(task.id)
    task.resolve(result)
  }

  private rejectTask(task: QueuedTask<unknown>, error: unknown): void {
    if (task.settled) {
      return
    }

    task.settled = true
    this.tasks.delete(task.id)
    task.reject(error)
  }
}

export default WorkerPool
