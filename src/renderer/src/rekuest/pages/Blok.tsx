import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { registry } from "@/app/localactions";
import { LocalActionButton } from "@/components/ui/localactionbutton";
import { RekuestBlok, RekuestMaterializedBlok } from "@/linkers";
import DemoBlokRenderer from "@/rekuest/components/DemoBlokRenderer";
import { useGetBlokQuery } from "../api/graphql";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MaterializeBlokForm } from "../forms/MaterializeBlokForm";
import { useState } from "react";
import { toast } from "sonner";

export const BlokPage = asDetailQueryRoute(useGetBlokQuery, ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <RekuestBlok.ModelPage
      title={data.blok.name || "New Dasboard"}
      object={data.blok}
      pageActions={(
        <>
            <LocalActionButton
                name={"rekuest-delete-blok" as keyof typeof registry}
                state={{
                  left: [
                    {
                      identifier: '@rekuest/blok',
                      object: { id: data.blok.id },
                    },
                  ],
                  isCommand: false,
                }}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default">Materialize Blok</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Materialize Blok</DialogTitle>
                    </DialogHeader>
                    {data.blok.dependencies && (
                        <MaterializeBlokForm
                            blokId={data.blok.id}
                            dependencies={data.blok.dependencies.map((dependency) => ({
                              id: dependency.id,
                              key: dependency.key,
                            }))}
                          onMaterialized={(_materializedBlok) => {
                                setOpen(false);
                                toast.success("Blok Materialized!");
                                // navigate to the materialized dashboard/blok here if applicable
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog></>
      )}
    >
      <div className="relative flex h-full w-full flex-col gap-4 p-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <section className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-muted/25 p-4 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Blok State
              </h2>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{data.blok.name}</p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Catalog
                </p>
                <p className="mt-1 text-sm font-medium">{data.blok.catalog.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Dependencies
                </p>
                <p className="mt-1 text-sm font-medium">{data.blok.dependencies.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Materializations
                </p>
                <p className="mt-1 text-sm font-medium">{data.blok.materializedBloks.length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
              The preview is built from the stored blok UI payload and seeded with the demo state through the A2UI renderer.
            </div>
          </section>

          <section className="rounded-3xl border border-border/70 bg-background/70 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Materialized Blok Index</h2>
                <p className="text-sm text-muted-foreground">
                  All materialized instances for this blok, ready to open.
                </p>
              </div>
              <div className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                {data.blok.materializedBloks.length}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {data.blok.materializedBloks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                  No materialized bloks yet.
                </div>
              ) : (
                data.blok.materializedBloks.map((materializedBlok) => (
                  <div
                    key={materializedBlok.id}
                    className="rounded-2xl border border-border/60 bg-background/80 p-4 transition-colors hover:border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          Materialized Blok
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-foreground">
                          <RekuestMaterializedBlok.DetailLink object={materializedBlok}>
                            {materializedBlok.id}
                          </RekuestMaterializedBlok.DetailLink>
                        </p>
                      </div>
                      <div className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
                        {materializedBlok.blok.name}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/35 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Preview Workspace</h2>
              <p className="text-sm text-muted-foreground">
                Expanded preview area for inspecting the blok layout below the state summary.
              </p>
            </div>
            <div className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              {data.blok.id}
            </div>
          </div>

          <div className="min-h-[36rem] overflow-hidden">
            <DemoBlokRenderer
              surfaceId={`${data.blok.id}-expanded`}
              blok={data.blok}
            />
          </div>
        </section>
      </div>
    </RekuestBlok.ModelPage>
  );
});


export default BlokPage;
