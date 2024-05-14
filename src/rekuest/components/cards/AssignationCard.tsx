import { MikroChannelView, RekuestAssignation } from "@/linkers";
import {
  PostmanAssignationFragment,
  WatchAssignationEventsDocument,
  WatchAssignationEventsSubscription,
  WatchAssignationEventsSubscriptionVariables,
  useDetailAssignationQuery,
} from "../../api/graphql";
import { MateFinder } from "@/mates/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useEffect } from "react";
interface Props {
  assignation: PostmanAssignationFragment;
  mates?: MateFinder[];
}

const TheCard = ({ assignation, mates }: Props) => {
  return (
    <RekuestAssignation.Smart object={assignation?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestAssignation.DetailLink object={assignation.id}>
              {assignation.reservation.node.name}
            </RekuestAssignation.DetailLink>
            {assignation.events.at(0)?.kind}
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestAssignation.Smart>
  );
};

export default TheCard;
