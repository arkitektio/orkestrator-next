import { RgbViewFragment } from "@/mikro-next/api/graphql";
import { useArray } from "../final/useArray";

export const useCalculateMinMaxFor = (view: RgbViewFragment) => {
  const { renderSelection } = useArray({
    store: view.image.store,
  });

  const calculateMinMax = async (signal: AbortSignal) => {
    if (!renderSelection) {
      throw new Error("Render view is not available");
    }

    const selection = [
      {
        start: view.cMin || null,
        stop: view.cMax || null,
        step: null,
      },
      {
        start: view.tMin || null,
        stop: view.tMax || null,
        step: null,
      },
      {
        start: view.zMin || null,
        stop: view.zMax || null,
        step: null,
      },
      { start: null, stop: null, step: null },
      { start: null, stop: null, step: null },
    ];

    const chunk = await renderSelection(signal, selection);
    if (!chunk) {
      throw new Error("Chunk not found");
    }

    const data = chunk.chunk.data;

    if (!data || data.length === 0) {
      throw new Error("No data available for min/max calculation");
    }

    let min = 0;
    let max = 0;

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    }

    return { min, max };
  };

  return calculateMinMax;
};
