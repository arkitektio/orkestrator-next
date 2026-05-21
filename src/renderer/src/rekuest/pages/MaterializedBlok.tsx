import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import BlokRenderer from "@/blok/renderer/BlokRenderer";
import {
  RekuestAgent,
  RekuestBlok,
  RekuestDashboard,
  RekuestMaterializedBlok,
} from "@/linkers";
import { useMaterializedBlokQuery } from "../api/graphql";

export const MaterializedBlokPage = asDetailQueryRoute(useMaterializedBlokQuery, ({ data }) => {
  const materializedBlok = data.materializedBlok;

  return (
    <RekuestMaterializedBlok.ModelPage
      title={materializedBlok.blok.name || materializedBlok.id}
      object={materializedBlok}
    >
      <div className="relative flex h-full w-full flex-col gap-4 p-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <section className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-muted/25 p-4 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Materialized State
              </h2>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{materializedBlok.id}</p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Source Blok
                </p>
                <p className="mt-1 text-sm font-medium">
                  <RekuestBlok.DetailLink object={materializedBlok.blok}>
                    {materializedBlok.blok.name}
                  </RekuestBlok.DetailLink>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Dashboard
                </p>
                <p className="mt-1 text-sm font-medium">
                  <RekuestDashboard.DetailLink object={materializedBlok.dashboard}>
                    {materializedBlok.dashboard.id}
                  </RekuestDashboard.DetailLink>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Agent Mappings
                </p>
                <p className="mt-1 text-sm font-medium">{materializedBlok.agentMappings.length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Agent Bindings
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dependency keys assigned on this materialized blok.
                  </p>
                </div>
                <div className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  {materializedBlok.agentMappings.length}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {materializedBlok.agentMappings.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                    No agent mappings configured.
                  </div>
                ) : (
                  materializedBlok.agentMappings.map((mapping) => (
                    <div
                      key={`${mapping.key}-${mapping.agent.id}`}
                      className="rounded-2xl border border-border/60 bg-background/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Dependency Key
                          </p>
                          <p className="mt-1 truncate text-sm font-semibold text-foreground">
                            {mapping.key}
                          </p>
                        </div>
                        <div className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
                          Agent
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-muted-foreground">
                        <RekuestAgent.DetailLink object={mapping.agent}>
                          {mapping.agent.id}
                        </RekuestAgent.DetailLink>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border/70 bg-background/70 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Materialized Overview</h2>
                <p className="text-sm text-muted-foreground">
                  Source blok metadata and active preview payload for this instance.
                </p>
              </div>
              <div className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                {Array.isArray(materializedBlok.blok.uiComponents)
                  ? `${materializedBlok.blok.uiComponents.length} nodes`
                  : "A2UI stream"}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
              This page reuses the blok renderer against the source blok payload attached to the materialized instance.
            </div>
          </section>
        </div>

        <section className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/35 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Live Preview</h2>
              <p className="text-sm text-muted-foreground">
                Rendering the same source blok payload used for this materialized instance.
              </p>
            </div>
            <div className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              {materializedBlok.id}
            </div>
          </div>

          <div className="min-h-[36rem] overflow-hidden">
            <BlokRenderer
              surfaceId={materializedBlok.id}
              uiComponents={materializedBlok.blok.uiComponents}
              demoState={materializedBlok.blok.demoState}
            />
          </div>
        </section>
      </div>
    </RekuestMaterializedBlok.ModelPage>
  );
});

export default MaterializedBlokPage;
