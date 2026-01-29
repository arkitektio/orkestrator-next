import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokRedeemToken } from "@/linkers";
import { useGetRedeemTokenQuery } from "../api/graphql";

export default asDetailQueryRoute(useGetRedeemTokenQuery, ({ data }) => {
  const resolve = useResolve();

  return (
    <LokRedeemToken.ModelPage
      object={data.redeemToken.id}
      actions={<LokRedeemToken.Actions object={data?.redeemToken?.token} />}
      title={data?.redeemToken?.token}
      sidebars={<LokRedeemToken.Komments object={data?.redeemToken?.id} />}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.redeemToken.token}
            </div>
          </div>
        </div>
        <div className="col-span-2"></div>
      </div>
    </LokRedeemToken.ModelPage>
  );
});
