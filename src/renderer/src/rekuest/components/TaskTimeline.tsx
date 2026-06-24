"use client";

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/timeline/timeline";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import Timestamp from "react-timestamp";
import { PostmanTaskFragment } from "../api/graphql";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

interface TimelineLayoutProps {
  task: PostmanTaskFragment;
}
export const TaskTimeline = ({ task }: TimelineLayoutProps) => {
  const { registry } = useWidgetRegistry();
  return (
    <Timeline className="w-full">
      {task.events.map((e) => (
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon />
            <TimelineTitle>{e.kind}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>
              <Timestamp date={e.createdAt} relative />
              <br />
              {e.returns && (
                <ReturnsContainer
                  ports={task.action.returns}
                  values={e.returns}
                  registry={registry}
                />
              )}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
