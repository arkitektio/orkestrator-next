import { Explainer } from '@/components/explainer/Explainer'
import { MikroADataset } from '@/linkers'
import { useParams } from 'react-router-dom'
import ADatasetList from '../components/lists/ADatasetList'
import { ADATASET_SPEC_BY_SLUG } from '../specs'

/**
 * One array-dataset list per spec, filtered server-side. A route per spec rather
 * than ?spec= on the list page: PageLayout's sidebar toggles rewrite the query
 * string wholesale, which would drop the filter out from under the user.
 */
const Page = () => {
  const { spec: slug } = useParams<{ spec: string }>()
  const entry = slug ? ADATASET_SPEC_BY_SLUG[slug] : undefined

  if (!entry) {
    return (
      <MikroADataset.ListPage title="Unknown spec">
        <div className="p-3 text-sm text-muted-foreground">
          No array dataset spec named “{slug}”.
        </div>
      </MikroADataset.ListPage>
    )
  }

  return (
    <MikroADataset.ListPage title={entry.label}>
      <div className="p-3">
        <Explainer title={entry.label} description={entry.description} />
        <ADatasetList
          filters={{ spec: [entry.spec] }}
          pagination={{ limit: 30 }}
          title={entry.label}
        />
      </div>
    </MikroADataset.ListPage>
  )
}

export default Page
