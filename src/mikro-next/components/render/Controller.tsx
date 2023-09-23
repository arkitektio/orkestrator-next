import { Button } from "@/components/ui/button";
import { View, useView } from "@/providers/view/ViewContext";


    

export const TwoDViewController = (props: {
    zSize: number,
    tSize: number,
    cSize: number
}) => {

    const { activeView, setWith} = useView();



    return <><div className="flex flex-row gap-2 text-xs">
        
    {activeView.zMin == undefined || activeView.zMin == null || activeView.zMin  < props.zSize - 1 && <Button onClick={() => {
        setWith({
            zMin: (activeView.zMin || 0) +  1,
            zMax: (activeView.zMin || 0) +  1
        })
    }}> Z+ </Button>}
    {activeView.zMin == undefined || activeView.zMin == null|| activeView.zMin  > 0 && <Button onClick={() => {
        setWith({
            zMin: (activeView.zMin || 1 )-  1,
            zMax: (activeView.zMin || 1 )-  1
        })
    }}> Z- </Button>}
    {activeView.tMin == undefined || activeView.tMin == null|| activeView.tMin  < props.tSize - 1 && <Button onClick={() => {
        setWith({
            tMin: (activeView.tMin || 0) +  1,
            tMax: (activeView.tMin || 0 )+  1
        })
    }}> T+ </Button>}
    {activeView.tMin == undefined || activeView.tMin == null|| activeView.tMin  > 0 && <Button onClick={() => {
        setWith({
            tMin: (activeView.tMin || 1 )-  1,
            tMax: (activeView.tMin || 1 ) -  1
        })
    }}> T- </Button>}
    {activeView.cMin == undefined || activeView.cMin == null|| activeView.cMin  < props.cSize -1 && <Button onClick={() => {
        setWith({
            cMin: (activeView.cMin || 0) +  1,
            cMax: (activeView.cMin || 0) +  1
        })
    }}> C+ </Button>}
    {activeView.cMin == undefined || activeView.cMin == null || activeView.cMin  > 0 && <Button onClick={() => {
        setWith({
            cMin: (activeView.cMin || 1) -  1,
            cMax: (activeView.cMin || 1) -  1
        })
    }}> C- </Button>}


    
    
    
    </div>
    </>
}