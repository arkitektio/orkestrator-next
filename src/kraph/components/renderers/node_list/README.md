# Interactive Graph Query Renderers

All GraphQuery renderers now support interactive rendering through the `RenderGraphQuery` API, which provides server-side search, pagination, and dynamic data fetching.

## Components

### Interactive Renderers

#### `RenderGraphQueryNodeList`
Interactive NodeList component with:
- **Server-side search**: Search functionality with 300ms debouncing
- **Server-side pagination**: Navigate through pages of results
- **Server-side sorting**: Sort by columns (when supported by the backend)
- **Column visibility**: Toggle column visibility through dropdown menu
- **Loading states**: Shows loading indicators during data fetching
- **Error handling**: Displays error messages when queries fail

#### `RenderGraphQueryTable`
Interactive Table component with:
- **Server-side search**: Search functionality with 300ms debouncing
- **Server-side pagination**: Navigate through pages of results
- **Server-side sorting**: Sort by columns (when supported by the backend)
- **Column management**: Hide/show columns through dropdown menu
- **Loading states**: Shows loading indicators during data fetching
- **Error handling**: Displays error messages when queries fail

#### `RenderGraphQueryPairs`
Interactive Pairs component with:
- **Server-side search**: Search functionality with 300ms debouncing
- **Server-side pagination**: Navigate through pages of results
- **Loading states**: Shows loading indicators during data fetching
- **Error handling**: Displays error messages when queries fail

#### `RenderGraphQueryPath`
Interactive Path graph component with:
- **Server-side search**: Search functionality with 300ms debouncing
- **Dynamic path loading**: Load paths based on search criteria
- **Loading states**: Shows loading indicators during data fetching
- **Error handling**: Displays error messages when queries fail

### Convenience Components

#### `RenderGraphQuery`
Default interactive renderer (uses NodeList format).

#### `RenderGraphQueryAsTable`
Render as interactive table.

#### `RenderGraphQueryAsPairs`
Render as interactive pairs.

#### `RenderGraphQueryAsPath`
Render as interactive path graph.

### Enhanced Core Component

#### `SelectiveGraphQueryRenderer` (Enhanced)
The main renderer now supports an `interactive` prop to enable server-side rendering for all query types.

## Usage

### Option 1: Using convenience components
```tsx
import { 
  RenderGraphQuery,
  RenderGraphQueryAsTable,
  RenderGraphQueryAsPairs,
  RenderGraphQueryAsPath
} from "@/kraph/components/renderers/GraphQueryRenderer";

function MyPage() {
  return (
    <div>
      {/* Default (NodeList) */}
      <RenderGraphQuery id="your-graph-query-id" />
      
      {/* As Table */}
      <RenderGraphQueryAsTable id="your-graph-query-id" />
      
      {/* As Pairs */}
      <RenderGraphQueryAsPairs id="your-graph-query-id" />
      
      {/* As Path */}
      <RenderGraphQueryAsPath id="your-graph-query-id" />
    </div>
  );
}
```

### Option 2: Using SelectiveGraphQueryRenderer with interactive mode  
```tsx
import { SelectiveGraphQueryRenderer } from "@/kraph/components/renderers/GraphQueryRenderer";

function MyPage({ graphQuery }) {
  return (
    <SelectiveGraphQueryRenderer 
      graphQuery={graphQuery} 
      interactive={true} 
    />
  );
}
```

### Option 3: Using specific renderers directly
```tsx
import { RenderGraphQueryNodeList } from "@/kraph/components/renderers/node_list/NodeList";
import { RenderGraphQueryTable } from "@/kraph/components/renderers/table/GraphTable";
import { RenderGraphQueryPairs } from "@/kraph/components/renderers/pairs/Pairs";
import { RenderGraphQueryPath } from "@/kraph/components/renderers/graph/PathGraph";

function MyPage() {
  return (
    <div>
      <RenderGraphQueryNodeList 
        graphQueryId="your-graph-query-id"
        options={{ minimal: false }}
      />
      
      <RenderGraphQueryTable 
        graphQueryId="your-graph-query-id"
        options={{ minimal: false }}
      />
      
      <RenderGraphQueryPairs 
        graphQueryId="your-graph-query-id"
        options={{ minimal: false }}
      />
      
      <RenderGraphQueryPath 
        graphQueryId="your-graph-query-id"
        options={{ minimal: false }}
      />
    </div>
  );
}
```

## Features by Renderer Type

### All Renderers
- **Search**: Server-side search with 300ms debouncing
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Meaningful error messages
- **Minimal Mode**: Optional minimal UI through `options.minimal`

### Table & NodeList Only
- **Pagination**: Previous/Next navigation
- **Column Management**: Show/hide columns
- **Sorting**: Column-based sorting (when supported)

### Pairs Only
- **Pagination**: Previous/Next navigation
- **Entity Display**: Smart entity rendering with widgets

### Path Only
- **Interactive Graph**: React Flow-based graph visualization
- **Dynamic Layout**: Automatic node positioning with ELK

## Backend Requirements

All components use the `useRenderGraphQueryQuery` hook which calls the `renderGraphQuery` GraphQL query with these variables:

- `id`: The GraphQuery ID (required)
- `filters`: Contains search terms, limit, and offset (optional)
- `pagination`: Contains limit and offset for pagination (optional)
- `order`: Contains field and direction for sorting (optional)

The backend should support these parameters to provide the full interactive experience.

## Migration Guide

### From Static to Interactive

**Before:**
```tsx
// Static rendering
<SelectiveGraphQueryRenderer graphQuery={data.graphQuery} />
```

**After:**
```tsx
// Interactive rendering
<SelectiveGraphQueryRenderer graphQuery={data.graphQuery} interactive={true} />
```

### Direct Component Usage

**Before:**
```tsx
import { NodeListRender } from "./node_list/NodeList";
<NodeListRender list={staticData} />
```

**After:**
```tsx
import { RenderGraphQueryNodeList } from "./node_list/NodeList";
<RenderGraphQueryNodeList graphQueryId="query-id" />
```

## Examples

### Enable Interactive Mode on GraphQuery Page
```tsx
// GraphQueryPage.tsx
<SelectiveGraphQueryRenderer graphQuery={data.graphQuery} interactive={true} />
```

### Create a Custom Dashboard
```tsx
function Dashboard({ queryIds }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <RenderGraphQueryAsTable id={queryIds.summary} />
      <RenderGraphQueryAsPairs id={queryIds.relationships} />
      <RenderGraphQueryAsPath id={queryIds.workflow} />
      <RenderGraphQuery id={queryIds.entities} />
    </div>
  );
}
```

### Use with Search and Filters
```tsx
function SearchablePage() {
  return (
    <div>
      <h1>Entity Explorer</h1>
      {/* Interactive search, pagination, and sorting automatically included */}
      <RenderGraphQueryNodeList graphQueryId="entities-query" />
    </div>
  );
}
```

All existing static renderers continue to work unchanged, providing a smooth migration path to interactive functionality.