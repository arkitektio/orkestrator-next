import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { RekuestBlok } from "@/linkers";
import { useGetBlokQuery } from "../api/graphql";

export const BlokPage = asDetailQueryRoute(useGetBlokQuery, ({ data, refetch }) => {
  return (
    <RekuestBlok.ModelPage
      title={data.blok.name || "New Dasboard"}
      object={data.blok}
    >
      <div className="relative w-full h-full">Not implemented</div>
    </RekuestBlok.ModelPage>
  );
});


export default BlokPage;
