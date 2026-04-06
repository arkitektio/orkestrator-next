import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/providers/settings/SettingsContext";
import React from "react";

export const ThemeCustomizer: React.FC = () => {
  const { settings, setSettings } = useSettings();

  // Fallbacks map to your default light mode CSS variables
  const currentHue = settings.brandHue ?? 267.25;
  const currentChroma = settings.brandChroma ?? 0.21;

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, brandHue: parseFloat(e.target.value) });
  };

  const handleChromaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, brandChroma: parseFloat(e.target.value) });
  };

  const reset = () => {
    setSettings({ ...settings, brandHue: undefined, brandChroma: undefined });
  };

  // Pre-mapped OKLCH approximate equivalents for standard Tailwind colors
  const presets = [
    { name: "Red", hue: 27, chroma: 0.22 },
    { name: "Orange", hue: 45, chroma: 0.2 },
    { name: "Amber", hue: 70, chroma: 0.2 },
    { name: "Yellow", hue: 100, chroma: 0.18 },
    { name: "Lime", hue: 130, chroma: 0.18 },
    { name: "Green", hue: 145, chroma: 0.18 },
    { name: "Emerald", hue: 160, chroma: 0.16 },
    { name: "Teal", hue: 175, chroma: 0.15 },
    { name: "Cyan", hue: 195, chroma: 0.15 },
    { name: "Sky", hue: 225, chroma: 0.15 },
    { name: "Blue", hue: 250, chroma: 0.2 },
    { name: "Indigo", hue: 275, chroma: 0.2 },
    { name: "Violet", hue: 290, chroma: 0.2 },
    { name: "Purple", hue: 310, chroma: 0.2 },
    { name: "Fuchsia", hue: 330, chroma: 0.2 },
    { name: "Pink", hue: 345, chroma: 0.2 },
    { name: "Rose", hue: 355, chroma: 0.2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Brand Hue Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="brand-hue">Brand Hue (°)</Label>
            <span className="text-sm text-muted-foreground">{currentHue.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              id="brand-hue"
              type="range"
              min="0"
              max="360"
              step="0.1"
              value={currentHue}
              onChange={handleHueChange}
              className="flex-1 accent-primary"
            />
            <Input
              type="number"
              min="0"
              max="360"
              step="0.1"
              value={currentHue}
              onChange={handleHueChange}
              className="w-20"
            />
          </div>
        </div>

        {/* Brand Chroma Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="brand-chroma">Brand Chroma</Label>
            <span className="text-sm text-muted-foreground">{currentChroma.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              id="brand-chroma"
              type="range"
              min="0"
              max="0.4"
              step="0.001"
              value={currentChroma}
              onChange={handleChromaChange}
              className="flex-1 accent-primary"
            />
            <Input
              type="number"
              min="0"
              max="0.4"
              step="0.001"
              value={currentChroma}
              onChange={handleChromaChange}
              className="w-20"
            />
          </div>
        </div>

        {/* Current Color Preview & Reset */}
        <div className="flex items-center gap-4 pt-2">
          <div
            className="w-12 h-12 rounded-md border shadow-sm"
            style={{ backgroundColor: `oklch(60% ${currentChroma} ${currentHue})` }}
            title={`oklch(60% ${currentChroma} ${currentHue})`}
          />
          <div className="flex-1 text-sm font-mono text-muted-foreground">
            oklch(L {currentChroma.toFixed(3)} {currentHue.toFixed(1)})
          </div>
          <Button variant="outline" onClick={reset}>
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Presets */}
      <div className="grid gap-2">
        <Label>Presets</Label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              className="w-8 h-8 rounded-full border border-input ring-offset-background hover:ring-2 hover:ring-ring hover:ring-offset-2 transition-all"
              style={{ backgroundColor: `oklch(60% ${p.chroma} ${p.hue})` }}
              onClick={() => setSettings({ ...settings, brandHue: p.hue, brandChroma: p.chroma })}
              aria-label={`Set color to ${p.name}`}
              title={p.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
