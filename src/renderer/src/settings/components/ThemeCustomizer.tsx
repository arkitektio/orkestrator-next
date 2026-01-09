import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/providers/settings/SettingsContext";
import React, { useEffect, useState } from "react";

export const ThemeCustomizer: React.FC = () => {
    const { settings, setSettings } = useSettings();
    const [color, setColor] = useState(settings.primaryColor || "#000000"); // Default fallback

    // Sync state with settings
    useEffect(() => {
        if (settings.primaryColor) {
             // If it's oklch or other format, input type=color won't show it correctly if we don't convert.
             // But for now let's assume if user picks, it becomes hex.
             // If it is currently oklch, input color shows black (invalid).
             // We can use a simple convert function or just accept it's decoupled initially.
             setColor(settings.primaryColor.startsWith("#") ? settings.primaryColor : "#000000");
        }
    }, [settings.primaryColor]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        setSettings({ ...settings, primaryColor: newColor });
    };

    const reset = () => {
        setSettings({ ...settings, primaryColor: undefined });
    }

    const predefinedColors = [
        "#000000",
        "#ffffff",
        "#ef4444", // Red
        "#f97316", // Orange
        "#f59e0b", // Amber
        "#eab308", // Yellow
        "#84cc16", // Lime
        "#22c55e", // Green
        "#10b981", // Emerald
        "#14b8a6", // Teal
        "#06b6d4", // Cyan
        "#0ea5e9", // Sky
        "#3b82f6", // Blue
        "#6366f1", // Indigo
        "#8b5cf6", // Violet
        "#a855f7", // Purple
        "#d946ef", // Fuchsia
        "#ec4899", // Pink
        "#f43f5e", // Rose
    ];


    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                     <Input
                        id="primary-color"
                        type="color"
                        value={color}
                        onChange={handleColorChange}
                        className="w-12 h-12 p-1 rounded-md cursor-pointer"
                    />
                    <Input
                        value={settings.primaryColor || ""}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        placeholder="Color value (Hex, rgb, oklch...)"
                        className="flex-1"
                    />
                    <Button variant="outline" onClick={reset}>Reset</Button>
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Presets</Label>
                <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((c) => (
                        <button
                            key={c}
                            className="w-8 h-8 rounded-full border border-input ring-offset-background hover:ring-2 hover:ring-ring hover:ring-offset-2 transition-all"
                            style={{ backgroundColor: c }}
                            onClick={() => setSettings({ ...settings, primaryColor: c })}
                            aria-label={`Set color to ${c}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
