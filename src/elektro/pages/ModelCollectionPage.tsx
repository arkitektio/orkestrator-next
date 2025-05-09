import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroModelCollection } from "@/linkers";
import { useDetailModelCollectionQuery } from "../api/graphql";
import NeuronModelCard from "../components/cards/NeuronModelCard";
import { Card } from "@/components/ui/card";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailModelCollectionQuery,
  ({ data, subscribeToMore }) => {

    return (
      <ElektroModelCollection.ModelPage
        title={data?.modelCollection?.name}
        object={data.modelCollection.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroModelCollection.ObjectButton object={data.modelCollection.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroModelCollection.Komments object={data.modelCollection.id} />,
            }}
          />
        }
      >
         <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6 h-96">
                <div>
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {data.modelCollection.name}
                  </h1>
                  <p className="mt-3 text-xl text-muted-foreground">
                    {data.modelCollection.id}
                  </p>
                </div>
                <Card className="w-full h-full flex-row relative">
                  {data.modelCollection.__typename}
                </Card>
              </div>
        <div className="grid grid-cols-6 gap-2 w-full">
        {data.modelCollection.models.map((model) => {
          return <NeuronModelCard key={model.id} item={model} />;
        })}
        </div>
      </ElektroModelCollection.ModelPage>
    );
  },
);
