import { useMemo } from "react";
import { RgbViewFragment } from "@/mikro-next/api/graphql";
import { useBrandOverride } from "@/providers/settings/useBrandOverride";
import { brandTargetFromColors, colormapRepresentativeRgb } from "./brandTarget";

type Props = {
  views: readonly RgbViewFragment[] | undefined;
};

/**
 * The `SceneBrandTheme` equivalent for the legacy image page, which renders an
 * `RGBContext`'s views rather than scene layers. Same tint, same easing — an
 * image has no layer selection, so all its ACTIVE views blend into the target.
 */
export const RgbViewBrandTheme = ({ views }: Props) => {
  const target = useMemo(
    () =>
      brandTargetFromColors(
        (views ?? [])
          .filter((view) => view.active)
          .map((view) => colormapRepresentativeRgb(view.colorMap, view.baseColor)),
      ),
    [views],
  );

  useBrandOverride(target);

  return null;
};
