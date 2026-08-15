import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  StructureFragment,
  useCreateEntityMutation,
  useCreateEntityTermInlineMutation,
  useEnsureStructureMutation,
  useSearchEntityTermsLazyQuery,
} from "@/kraph/api/graphql";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { Identifier, Object } from "@/types";
import { Microscope } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MetricsTable } from "../tables/MetricsTable";

export type KnowledgeSidebarProps = {
  identifier: Identifier;
  object: Object;
};

type ClaimFormValues = { term: string };

/**
 * Claiming is organization-scoped. "This ROI is an AIS" is true of the object,
 * not of one graph: the claim names a word, and every graph that declares that
 * word holds it. So there is no graph to choose here and nothing to pin — this
 * used to be an accordion over pinned graphs, one lookup per graph, which asked
 * a question the claim does not depend on.
 *
 * `createEntity` takes the structure directly as supporting evidence, so a
 * claim needs no graph, no category and no pre-existing entity or structure.
 */
export const KnowledgeSidebar = ({ identifier, object }: KnowledgeSidebarProps) => {
  // There is no organization-wide read for a structure by identifier + object
  // (`structureByIdentifier` still takes a graph), so the evidence already
  // recorded is fetched through the idempotent `ensureStructure` rather than on
  // mount — viewing an object should not write one.
  const [structure, setStructure] = useState<StructureFragment | null>(null);

  const [ensureStructure, { loading: loadingEvidence }] =
    useEnsureStructureMutation();
  const [createEntity, { loading: claiming }] = useCreateEntityMutation();
  const [searchTerms] = useSearchEntityTermsLazyQuery();
  const [createTerm] = useCreateEntityTermInlineMutation();

  const form = useForm<ClaimFormValues>({ defaultValues: { term: "" } });

  const loadEvidence = async () => {
    try {
      const result = await ensureStructure({
        variables: { input: { identifier, object: object.id } },
      });
      setStructure(result.data?.ensureStructure ?? null);
    } catch (e) {
      toast.error(`Could not load evidence: ${(e as Error).message}`);
    }
  };

  const claim = async ({ term }: ClaimFormValues) => {
    if (!term) return;
    try {
      await createEntity({
        variables: {
          input: {
            term,
            supportingEvidence: [{ identifier, object: object.id }],
          },
        },
      });
      toast.success(`Claimed as ${term}`);
      form.reset({ term: "" });
      await loadEvidence();
    } catch (e) {
      toast.error(`Could not claim: ${(e as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col h-full p-3 gap-4 overflow-y-auto">
      <div>
        <div className="text-sm font-semibold">Claim as</div>
        <p className="text-xs text-muted-foreground mt-1">
          The organization's word for what this is. Every graph that declares
          the word will hold the claim; one that declares no category for it
          simply will not draw it.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(claim)}
          className="flex flex-col gap-2"
        >
          <GraphQLCreatableSearchField
            name="term"
            label=""
            description="Type a new word to claim it."
            searchQuery={searchTerms}
            createMutation={createTerm}
          />
          <Button type="submit" variant="outline" disabled={claiming}>
            {claiming ? "Claiming…" : "Claim"}
          </Button>
        </form>
      </Form>

      <Separator />

      <div className="flex flex-row gap-2">
        <ObjectButton
          objects={[{ identifier, object }]}
          className="w-full"
          disableKraph={true}
          expect={["@mikro/metric"]}
          onDone={loadEvidence}
        >
          <Button variant="outline" className="w-full">
            <Microscope className="mr-2 h-4 w-4" />
            Measure
          </Button>
        </ObjectButton>
      </div>

      {structure ? (
        structure.metrics.length > 0 ? (
          <MetricsTable metrics={structure.metrics} />
        ) : (
          <p className="text-xs text-muted-foreground">
            Nothing has been measured on this yet.
          </p>
        )
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={loadEvidence}
          disabled={loadingEvidence}
        >
          {loadingEvidence ? "Loading…" : "Show recorded measurements"}
        </Button>
      )}
    </div>
  );
};
