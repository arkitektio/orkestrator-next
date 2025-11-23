import { Button } from "@/components/ui/button";
import { useSettings } from "@/providers/settings/SettingsContext"

export const AgentController = (props) => {
  const { settings, setSettings } = useSettings();


  return <div className="w-full flex flex-col items-center justify-center space-y-4 bg-foreground/5 p-4 rounded-t-lg border-t border-t-border border-t-gray-600">
    {settings.startAgent && <div className="text-xs text-muted-foreground">This app can be controlled by other users.</div>}
    <Button onClick={() => setSettings({ ...settings, startAgent: !settings.startAgent })} variant={"outline"} className="w-full flex flex-row items-center justify-center gap-2">
      {!settings.startAgent ? <div className="h-4 w-4 rounded rounded-full bg-green-200"></div> : <div className="h-4 w-4 rounded rounded-full bg-red-200"></div>}
      {settings.startAgent ? "Stop Agent" : "Start Agent"}
    </Button>
  </div>

};
