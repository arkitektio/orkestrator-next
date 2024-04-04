import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "../ui/separator"


export type ChildMap = {
    [key: string]: React.ReactNode
}



export const MultiSidebar = (props: {map: ChildMap | undefined}) => {
    
    
    return <Tabs defaultValue={props.map && Object.keys(props.map).at(0) } className="w-full">
                <TabsList className="w-full flex flex-row h-16 bg-sidebar border-b dark:border-gray-700 rounded-xs">
                    {props.map && Object.keys(props.map).map((key) => {
                        return <TabsTrigger value={key} className="flex-1 h-full text-xl truncate px-2">{key}</TabsTrigger>

                    })}
                </TabsList>
                {props.map && Object.keys(props.map).map((key) => {
                    return <TabsContent value={key}>{props.map && props.map[key]}</TabsContent>
                })}
        </Tabs>
}