import React from "react";
import { EntitiesTable } from "../components/tables/EntitiesTable";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return <EntitiesTable />;
};

export default Page;
