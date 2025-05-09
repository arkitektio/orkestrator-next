import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaCollection, LovekitStream } from "@/linkers";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { StringField } from "@/components/fields/StringField";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { PortKind } from "@/rekuest/api/graphql";
import { useGetStreamQuery } from "../api/graphql";



export default asDetailQueryRoute(
  useGetStreamQuery,
  ({ data, subscribeToMore }) => {
    return (
      <LovekitStream.ModelPage
        title={data?.stream.id}
        object={data.stream.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <LovekitStream.ObjectButton object={data.stream.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <LovekitStream.Komments object={data.stream.id} />
              ),
            }}
          />
        }
      >
        {data.stream.id}
      </LovekitStream.ModelPage>
    );
  },
);
