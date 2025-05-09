import { PageLayout } from "@/components/layout/PageLayout";
import ActionList from "@/rekuest/components/lists/ActionList";
import { useDescriptors } from "../interfaces/hooks/useDescriptors";
import { Descriptor } from "../interfaces/types";
import { useAgentsForDescriptor } from "../interfaces/hooks/useAgentsForInterface";
import { Card } from "@/components/ui/card";

import React, { useEffect, useRef, useState } from "react";
import { Arkitekt } from "@/arkitekt/Arkitekt";
import { DroppableNavLink } from "@/components/ui/link";

export const ConditionalDescriptorRenderer = ({
  descriptor,
}: {
  descriptor: Descriptor<any, any>;
}) => {
  const { data } = useAgentsForDescriptor(descriptor.name);

  return (
    <div className="flex flex-col">
      <div className="scroll-m-20 text-2xl">{descriptor.name}</div>
      <div className="flex flex-row">
        {data?.agents && data?.agents.length > 0 ? (
          <>
            {data.agents.map((agent) => (
              <Card>
                <DroppableNavLink
                  to={`/rekuest/interfaces/${descriptor.name}/${agent.id}`}
                  className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
                >
                  <div className="flex items-center justify-between">
                    <div>{agent.name}</div>
                    <div>{agent.id}</div>
                  </div>
                </DroppableNavLink>
              </Card>
            ))}
          </>
        ) : (
          <div>No agents acting like microscopes</div>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const descriptors = useDescriptors();

  return (
    <PageLayout title={"Actions"}>
      <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your Interfaces
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Interfaces are dedicated UIs that allow you to interact with your
            agents using some specialised widgets. Interfaces are going to be
            designed as plugins to orkestrator and in the future, and should be
            able to be loaded dynamically.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {descriptors.map((descriptor) => (
          <ConditionalDescriptorRenderer descriptor={descriptor} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Page;
