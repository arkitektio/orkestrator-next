import { Identifier, Structure } from "@/types";
import { PageLayout, PageVariant } from "./PageLayout";
import { useSmartDrop } from "@/providers/smart/hooks";
import { useState } from "react";
import { Card } from "../ui/card";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { toast } from "sonner";
import { useAssign } from "@/rekuest/hooks/useAssign";
import {
  ListTemplateFragment,
  PrimaryNodeFragment,
} from "@/rekuest/api/graphql";
import { Dialog, DialogContent } from "../ui/dialog";
import { NodeAssignForm } from "@/rekuest/forms/NodeAssignForm";

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
  callback?: (object: string) => void;
};

export const ModelPageLayout = ({
  sidebars,
  title,
  children,
  identifier,
  object,
  variant,
  callback,
  actions,
  pageActions,
}: ModelPageLayoutProps) => {
  return (
    <div className="h-full w-full">
      <PageLayout
        title={title}
        sidebars={<>{sidebars}</>}
        actions={actions}
        variant={variant}
        pageActions={pageActions}
      >
        {children}
      </PageLayout>
    </div>
  );
};
