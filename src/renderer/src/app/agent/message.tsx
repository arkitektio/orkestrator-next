import { z } from "zod";

export const LogLevel = z.enum(["DEBUG", "INFO", "ERROR", "WARN", "CRITICAL"]);

export const ToAgentMessageType = z.enum([
  "ASSIGN",
  "CANCEL",
  "STEP",
  "COLLECT",
  "RESUME",
  "PAUSE",
  "INTERRUPT",
  "PROVIDE",
  "UNPROVIDE",
  "INIT",
  "HEARTBEAT",
]);

export const FromAgentMessageType = z.enum([
  "REGISTER",
  "LOG",
  "PROGRESS",
  "DONE",
  "YIELD",
  "ERROR",
  "PAUSED",
  "CRITICAL",
  "STEPPED",
  "RESUMED",
  "CANCELLED",
  "APP_CANCELLED",
  "ASSIGNED",
  "INTERRUPTED",
  "HEARTBEAT_ANSWER",
]);

export const ShallowJSONSerializable = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.record(z.string(), z.any()),
  z.array(z.any()),
]);

export const Message = z.object({
  id: z.string().uuid({ version: "v4" }).optional(),
});

export const Assign = Message.extend({
  type: z.literal(ToAgentMessageType.enum.ASSIGN),
  interface: z.string(),
  extension: z.string(),
  reservation: z.string().optional().nullable(),
  dependencies: z.record(z.string(), z.string()).optional().nullable(),
  assignation: z.string(),
  root: z.string().optional().nullable(),
  parent: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  capture: z.boolean().optional().nullable(),
  args: z.record(z.string(), ShallowJSONSerializable),
  message: z.string().optional().nullable(),
  user: z.string(),
  app: z.string(),
  org: z.string(),
  action: z.string(),
});

export const Step = Message.extend({
  type: z.literal(ToAgentMessageType.enum.STEP),
  assignation: z.string(),
});

export const Heartbeat = Message.extend({
  type: z.literal(ToAgentMessageType.enum.HEARTBEAT),
});

export const Pause = Message.extend({
  type: z.literal(ToAgentMessageType.enum.PAUSE),
  assignation: z.string(),
});

export const Resume = Message.extend({
  type: z.literal(ToAgentMessageType.enum.RESUME),
  assignation: z.string(),
});

export const Cancel = Message.extend({
  type: z.literal(ToAgentMessageType.enum.CANCEL),
  assignation: z.string(),
});

export const Collect = Message.extend({
  type: z.literal(ToAgentMessageType.enum.COLLECT),
  drawers: z.array(z.string()),
});

export const Interrupt = Message.extend({
  type: z.literal(ToAgentMessageType.enum.INTERRUPT),
  assignation: z.string(),
});

export const AssignInquiry = z.object({
  assignation: z.string(),
});

export const Init = Message.extend({
  type: z.literal(ToAgentMessageType.enum.INIT),
  instance_id: z.string(),
  agent: z.string(),
  inquiries: z.array(AssignInquiry).default([]),
});

export const CancelledEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.CANCELLED),
  assignation: z.string(),
});

export const InterruptedEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.INTERRUPTED),
  assignation: z.string(),
});

export const PausedEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.PAUSED),
  assignation: z.string(),
});

export const ResumedEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.RESUMED),
  assignation: z.string(),
});

export const SteppedEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.STEPPED),
});

export const LogEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.LOG),
  assignation: z.string(),
  message: z.string(),
  level: LogLevel.default("INFO"),
});

export const ProgressEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.PROGRESS),
  assignation: z.string(),
  progress: z.number().optional().nullable(),
  message: z.string().optional().nullable(),
});

export const YieldEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.YIELD),
  assignation: z.string(),
  returns: z.record(z.string(), z.any()).optional().nullable(),
});

export const DoneEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.DONE),
  assignation: z.string(),
});

export const ErrorEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.ERROR),
  assignation: z.string(),
  error: z.string(),
});

export const CriticalEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.CRITICAL),
  assignation: z.string(),
  error: z.string(),
});

export const HeartbeatEvent = Message.extend({
  type: z.literal(FromAgentMessageType.enum.HEARTBEAT_ANSWER),
});

export const Register = Message.extend({
  type: z.literal(FromAgentMessageType.enum.REGISTER),
  instance_id: z.string(),
  token: z.string(),
});

export const ToAgentMessage = z.discriminatedUnion("type", [
  Init,
  Assign,
  Cancel,
  Interrupt,
  Heartbeat,
  Step,
  Pause,
  Resume,
  Collect,
]);

export const FromAgentMessage = z.discriminatedUnion("type", [
  CriticalEvent,
  LogEvent,
  ProgressEvent,
  DoneEvent,
  ErrorEvent,
  YieldEvent,
  Register,
  HeartbeatEvent,
  SteppedEvent,
  ResumedEvent,
  PausedEvent,
  CancelledEvent,
  InterruptedEvent,
]);

export type ToAgentMessage = z.infer<typeof ToAgentMessage>;
export type FromAgentMessage = z.infer<typeof FromAgentMessage>;
export type Assign = z.infer<typeof Assign>;
export type Init = z.infer<typeof Init>;
export type CancelMessage = z.infer<typeof Cancel>;
export type Heatbeat = z.infer<typeof Heartbeat>;
export type Register = z.infer<typeof Register>;
export type DoneEvent = z.infer<typeof DoneEvent>;
export type ErrorEvent = z.infer<typeof ErrorEvent>;
export type YieldEvent = z.infer<typeof YieldEvent>;
export type CancelledEvent = z.infer<typeof CancelledEvent>;
export type InterruptedEvent = z.infer<typeof InterruptedEvent>;
export type LogEvent = z.infer<typeof LogEvent>;
export type ProgressEvent = z.infer<typeof ProgressEvent>;
