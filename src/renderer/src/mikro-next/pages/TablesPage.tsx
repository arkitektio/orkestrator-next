import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { MikroTable } from "@/linkers";
import React from "react";
import TableList from "../components/lists/TableList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <MikroTable.ListPage
      title="Tables"
      pageActions={
        <>
          <MikroTable.NewButton />
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Tables"
          description="Tables are just like excel sheets, but better. They are your go to for storing table-like data."
        />
        <TableList pagination={{ limit: 30 }} />
      </div>
    </MikroTable.ListPage>
  );
};

export default Page;
