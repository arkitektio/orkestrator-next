# TinyStructureBox Component Architecture

This document describes the refactored component architecture for the `TinyStructureBox` component, which has been broken down into smaller, more maintainable components.

## Component Structure

### Main Components

#### `TinyStructureBox`
- **Location**: `src/kraph/boxes/TinyStructureBox.tsx`
- **Purpose**: Main container component with authentication guard
- **Dependencies**: `ProtectedTinyStructureBox`, `Guard.Kraph`

#### `ProtectedTinyStructureBox`
- **Location**: `src/kraph/boxes/TinyStructureBox.tsx`
- **Purpose**: Main logic component that orchestrates data fetching and user interactions
- **Dependencies**: `KnowledgeViewCarousel`, `MeasurementDialog`, `useMeasurementDialog`
- **Key Features**:
  - Fetches knowledge views data
  - Handles structure connections
  - Manages measurement dialog state
  - Coordinates component interactions

### UI Components

#### `KnowledgeViewCarousel`
- **Location**: `src/kraph/components/KnowledgeViewCarousel.tsx`
- **Purpose**: Displays carousel of knowledge views
- **Props**:
  - `knowledgeViews`: Array of knowledge view data
  - `error`: Optional error state
  - `onConnect`: Callback for simple connection
  - `onConnectWithMeasurement`: Callback for measurement connection
- **Features**:
  - Responsive carousel layout
  - Error state handling
  - Empty state display

#### `KnowledgeViewCard`
- **Location**: `src/kraph/components/KnowledgeViewCard.tsx`
- **Purpose**: Individual card displaying a single knowledge view
- **Props**:
  - `view`: Knowledge view data
  - `onConnect`: Connection callback
  - `onConnectWithMeasurement`: Measurement connection callback
- **Features**:
  - Conditional rendering based on connection status
  - Node view rendering for connected structures
  - Action buttons for unconnected structures

#### `StructureConnectionActions`
- **Location**: `src/kraph/components/StructureConnectionActions.tsx`
- **Purpose**: Action buttons for structure connection
- **Props**:
  - `onConnect`: Simple connection callback
  - `onConnectWithMeasurement`: Measurement connection callback
- **Features**:
  - Two connection options: simple and with measurement
  - Consistent button styling and layout

#### `MeasurementDialog`
- **Location**: `src/kraph/components/MeasurementDialog.tsx`
- **Purpose**: Modal dialog for creating measurement connections
- **Props**:
  - `open`: Dialog open state
  - `onOpenChange`: Dialog state change callback
  - `selectedGraph`: Currently selected graph ID
  - `selectedGraphName`: Display name of selected graph
  - `identifier`: Structure identifier
  - `object`: Structure object
  - `onSuccess`: Success callback
- **Features**:
  - Tabbed interface (existing vs new categories)
  - Graph-filtered measurement category search
  - Entity search and selection
  - Form validation and submission
  - Automatic category creation

### Custom Hooks

#### `useMeasurementDialog`
- **Location**: `src/kraph/hooks/useMeasurementDialog.ts`
- **Purpose**: Manages measurement dialog state and interactions
- **Returns**:
  - `selectedGraph`: Currently selected graph ID
  - `showMeasurementDialog`: Dialog visibility state
  - `handleConnectWithMeasurement`: Function to open dialog with graph
  - `closeMeasurementDialog`: Function to close dialog and reset state
  - `setShowMeasurementDialog`: Direct state setter
- **Benefits**:
  - Encapsulates dialog logic
  - Reusable across components
  - Clean state management

## Benefits of Refactoring

### 1. **Separation of Concerns**
- Each component has a single, well-defined responsibility
- UI components are separated from business logic
- State management is isolated in custom hooks

### 2. **Reusability**
- Components can be used independently
- Custom hooks can be shared across different contexts
- Modular design allows for easy composition

### 3. **Maintainability**
- Smaller files are easier to understand and modify
- Bug fixes and feature additions are more isolated
- Testing becomes more focused and manageable

### 4. **Type Safety**
- Each component has well-defined prop interfaces
- TypeScript provides better error catching
- Clear contracts between components

### 5. **Performance**
- Components can be memoized independently
- Reduces unnecessary re-renders
- Better code splitting opportunities

## Usage Example

```tsx
// Simple usage
<TinyStructureBox
  identifier="example_identifier"
  object="example_object"
/>

// The component automatically handles:
// - Authentication via Guard.Kraph
// - Data fetching for knowledge views
// - Connection actions (simple and with measurement)
// - Measurement dialog management
// - Form validation and submission
```

## File Structure

```
src/kraph/
├── boxes/
│   └── TinyStructureBox.tsx          # Main container components
├── components/
│   ├── KnowledgeViewCarousel.tsx     # Carousel component
│   ├── KnowledgeViewCard.tsx         # Individual card component
│   ├── StructureConnectionActions.tsx # Action buttons
│   └── MeasurementDialog.tsx         # Measurement modal
└── hooks/
    └── useMeasurementDialog.ts       # Dialog state management
```

## Testing Strategy

Each component can be tested independently:

- **Unit Tests**: Test individual component logic and rendering
- **Integration Tests**: Test component interactions and data flow
- **Hook Tests**: Test custom hook behavior and state management
- **E2E Tests**: Test complete user workflows

This architecture provides a solid foundation for future enhancements and maintenance while keeping the codebase clean and organized.
