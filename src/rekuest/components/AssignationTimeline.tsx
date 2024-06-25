"use client";

import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
} from "@/components/timeline/timeline";
import { AssignationEventFragment } from "../api/graphql";
import Timestamp from "react-timestamp";

interface TimelineLayoutProps {
  events: AssignationEventFragment[]; // Replace any[] with the actual type of items.
}
export const AssignationTimeline = ({ events }: TimelineLayoutProps) => {
  return (
    <Timeline className="w-full">
      {events.map((e) => (
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
              {e.returns && JSON.stringify(e.returns)}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
