import { Card } from "@/components/ui/card";
import {
  MikroImage,
  MikroInstanceMaskView,
  MikroInstanceMaskViewLabel,
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { InstanceMaskViewFragment } from "../../api/graphql";
import React, { useEffect, useMemo, useState } from "react";
import { useResolve } from "@/datalayer/hooks/useResolve";

interface HistoryCardProps {
  item: InstanceMaskViewFragment;
  mates?: MateFinder[];
}

type Row = Record<string, unknown>;

const TheCard = ({ item, mates }: HistoryCardProps) => {
  const resolve = useResolve();

  const url = resolve(item?.labels?.presignedUrl) ?? null;
  const alias = useMemo(
    () => (item?.id ? `labels_${item.id}.parquet` : "labels.parquet"),
    [item?.id],
  );

  const [rows, setRows] = useState<Row[] | null>(null);
  const [cols, setCols] = useState<string[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url);

  return (
    <MikroInstanceMaskView.Smart object={item?.id} mates={mates} key={item.id}>
      <Card key={item.id} className="p-4 space-y-2">
        <p className="text-light text-xs">Is instance mask foddr</p>

        <MikroImage.DetailLink object={item.referenceView.image.id}>
          {item.referenceView.image.name}
        </MikroImage.DetailLink>

        {/* show the url for debugging if you want */}
        {/* <div className="text-xs text-muted-foreground break-all">{url}</div> */}

        {loading && <div className="text-sm">Loading preview…</div>}
        {err && (
          <div className="text-sm text-red-600">
            Failed to load parquet preview: {err}
          </div>
        )}

        {!loading && !err && rows && cols && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th
                      key={c}
                      className="text-left font-bold border-b py-1 pr-3"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <MikroInstanceMaskViewLabel.DetailLink
                      object={`${item.id}-${i}`}
                      key={i}
                      className="border-b last:border-0"
                    >
                      {cols.map((c) => (
                        <td key={c} className="py-1 pr-3 align-top">
                          {formatCell((r as any)[c])}
                        </td>
                      ))}
                    </MikroInstanceMaskViewLabel.DetailLink>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !err && rows && rows.length === 0 && (
          <div className="text-sm text-muted-foreground">No rows.</div>
        )}
      </Card>
    </MikroInstanceMaskView.Smart>
  );
};

function formatCell(v: unknown) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

export default TheCard;
