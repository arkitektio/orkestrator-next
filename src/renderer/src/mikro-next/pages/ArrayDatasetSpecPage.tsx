import { Explainer } from "@/components/explainer/Explainer";
import { MikroArrayDataset } from "@/linkers";
import { useParams } from "react-router-dom";
import { useArrayDatasetFilterBar } from "../components/filter/ArrayDatasetFilterBar";
import ArrayDatasetList from "../components/lists/ArrayDatasetList";
import { ADATASET_SPEC_BY_SLUG } from "../specs";

/**
 * One array-dataset list per spec, filtered server-side. A route per spec rather
 * than ?spec= on the list page: the spec is what the page IS, while the filter
 * bar's own state is what the user is narrowing it to.
 */
const Page = () => {
  const { spec: slug } = useParams<{ spec: string }>();
  const entry = slug ? ADATASET_SPEC_BY_SLUG[slug] : undefined;

  // Unconditional: the early return below must not change the hook count.
  const { filters, ordering, actions } = useArrayDatasetFilterBar({
    lockedSpec: entry?.spec,
  });

  if (!entry) {
    return (
      <MikroArrayDataset.ListPage title="Unknown spec">
        <div className="p-3 text-sm text-muted-foreground">
          No array dataset spec named “{slug}”.
        </div>
      </MikroArrayDataset.ListPage>
    );
  }

  return (
    <MikroArrayDataset.ListPage title={entry.label} pageActions={actions}>
      <div className="p-3 flex flex-col gap-3">
        <Explainer title={entry.label} description={entry.description} />
        <ArrayDatasetList
          filters={filters}
          ordering={ordering}
          title={entry.label}
        />
      </div>
    </MikroArrayDataset.ListPage>
  );
};

export default Page;
