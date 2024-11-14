import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MikroTable } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetTableQuery } from "../api/graphql";
import { TableTable } from "../components/tables/TableTable";

export default asDetailQueryRoute(useGetTableQuery, ({ data, refetch }) => {
  return (
    <MikroTable.ModelPage
      object={data.table.id}
      title={data.table.name}
      pageActions={<div className="flex flex-row gap-2"></div>}
      sidebars={<MikroTable.Komments object={data.table.id} />}
    >
      <div className="flex flex-col gap-2 h-full w-full">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.table.name}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.table.name}
            </p>
          </div>
        </div>
        <div className="p-6 flex-grow">
          <TableTable table={data.table} />
        </div>
      </div>
    </MikroTable.ModelPage>
  );
});
