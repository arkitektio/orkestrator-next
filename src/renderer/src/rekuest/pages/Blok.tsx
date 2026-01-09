import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { RekuestBlok } from "@/linkers";
import { useGetBlokQuery } from "../api/graphql";

export default asDetailQueryRoute(useGetBlokQuery, ({ data, refetch }) => {
  return (
    <RekuestBlok.ModelPage
      title={data.blok.name || "New Dasboard"}
      object={data.blok.id}
    >
      <div className="relative w-full h-full">Not implemented</div>
    </RekuestBlok.ModelPage>
  );
});
