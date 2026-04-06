import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { DokumentsPage } from "@/linkers";
import { useGetPageQuery } from "../api/graphql";

export const PagePage = asDetailQueryRoute(
  useGetPageQuery,
  ({ data, subscribeToMore }) => {

    const resolve = useResolve();


    return (
      <DokumentsPage.ModelPage
        title={data?.page.id}
        object={data?.page}
        pageActions={
          <div className="flex flex-row gap-2">
            <DokumentsPage.ObjectButton object={data.page} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <DokumentsPage.Komments object={data.page} />,
            }}
          />
        }
      >
        {data.page.id}
        {data.page.content}

        <Image src={resolve(data.page.image.presignedUrl)} className="w-full h-full" />

      </DokumentsPage.ModelPage>
    );
  },
);


export default PagePage;
