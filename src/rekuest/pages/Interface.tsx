import { PageLayout } from "@/components/layout/PageLayout";
import NodeList from "@/rekuest/components/lists/NodeList";
import {
  useDescriptor,
  useDescriptors,
} from "../interfaces/hooks/useDescriptors";
import { Descriptor } from "../interfaces/types";
import { useAgentsForDescriptor } from "../interfaces/hooks/useAgentsForInterface";
import { useEffect, useRef, useState } from "react";
import { Arkitekt } from "@/arkitekt";
import { useParams } from "react-router-dom";

export function WebComponentLoader({
  descriptor,
}: {
  descriptor: Descriptor<any, any>;
}) {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const fakts = Arkitekt.useFakts();
  const token = Arkitekt.useToken();

  useEffect(() => {
    const loadComponent = async () => {
      if (!isLoaded) {
        try {
          // Dynamically import the web component as a module
          await descriptor.loader();

          setIsLoaded(true);
        } catch (error) {
          console.error("Error loading the web component:", error);
        }
      }
    };

    loadComponent();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      const webComponent = document.createElement(descriptor.componentname);
      console.log(webComponent);
      webComponent.setAttribute("fakts", JSON.stringify(fakts));
      webComponent.setAttribute("token", token || "");
      containerRef.current.appendChild(webComponent);
    }
  }, [isLoaded, containerRef]);

  return <div ref={containerRef}></div>;
}

const Page = (props) => {
  const params = useParams();

  const descriptors = useDescriptors();

  const descriptor = useDescriptor(params.kind);

  return (
    <PageLayout title={params.kind}>
      <WebComponentLoader descriptor={descriptor} />
    </PageLayout>
  );
};

export default Page;
