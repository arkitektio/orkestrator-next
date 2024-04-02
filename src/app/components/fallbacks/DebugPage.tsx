import { PageLayout } from "@/components/layout/PageLayout";

export const DebugPage = (props: {data: any}) => {
    return (
        <PageLayout title="Error">
            <div className="text-foreground">Dbeug</div>
            <div className="p-3 @container ">
            <pre>
            {JSON.stringify(props.data, null, 2)}
            </pre>

            </div>
        </PageLayout>
    );
}