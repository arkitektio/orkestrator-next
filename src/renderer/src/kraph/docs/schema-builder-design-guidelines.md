# Schema Builder Design Guidelines

**Role**: You are an expert UI/UX Engineer specializing in Data Modeling tools. Use the following guidelines when generating code for the "Cypher Type" builder interface.

## 1. Visual Philosophy

**Context**: Users are performing complex architectural work. The UI must prioritize clarity and scannability over decoration.

**Layout Pattern**: Use a Split-Pane (Master-Detail) layout for the Schema Editor.

- **Left Pane**: PropertyList (Overview of the type's structure).
- **Right Pane**: PropertyInspector (Deep configuration of the selected property).
- **Avoid Modals**: Do not use modals for editing properties; they block context. Only use modals for destructive actions (Delete Type).

## 2. Component Specifications

### A. The "Type" Card (Dashboard View)

When listing available Cypher Types:

- **Visual Identity**: Assign a deterministic pastel background color and a unique icon (e.g., Lucide/Heroicons) based on the Type name hash.
- **Header**: Large, bold Title with the Type Name.
- **Metadata Row**: Use small "pill" badges to show:
  - Count of instances (e.g., "1.2k Nodes").
  - Count of properties.
- **Status**: If the type is System-defined (locked), show a padlock icon. If User-defined, show an edit menu.

### B. The Property List Item (Left Pane)

Each row representing a field in the Type definition must contain:

- **Drag Handle**: Six-dot grip icon on the far left (opacity 50%, 100% on hover).
- **Type Icon**: A distinct icon representing the data type (see Section 3).
- **Label & Key Stack**:
  - **Primary Text**: The Human-readable Label (e.g., "Phone Number") in `font-sans`, `font-medium`.
  - **Secondary Text**: The Database Key (e.g., `phone_number`) in `font-mono`, `text-xs`, `text-muted`.
- **Attribute Badges**: Small icons on the right edge indicating status:
  - Searchable (Magnifying glass).
  - Required (Asterisk `*`).
  - Unique (Fingerprint).

### C. The Property Inspector (Right Pane)

When a property is selected:

- **Header**: Large input for the "Display Name".
- **Key Field**: An auto-generated, editable code style input for the machine key.
- **Type Selector**: A prominent dropdown or card-grid to change the Data Type.
- **Configuration Groups**: Group settings using `<fieldset>` or distinct bordered boxes:
  - **Validation**: (Required, Min/Max, Regex).
  - **Indexing/Search**: (Full-text, Exact Match, Sortable).
  - **Presentation**: (Placeholder text, Help tooltips).

## 3. Data Type Iconography

Always use specific visual cues for these types:

- **String**: Type / Text icon (Blue).
- **Number/Int**: Hash / Calculator icon (Green).
- **Boolean**: Toggle / Check icon (Orange).
- **Date/Time**: Calendar / Clock icon (Teal).
- **Relationship/Link**: ArrowRightCircle or Network icon (Purple).
  - *Note*: This indicates a graph edge.

## 4. Visualizing Search & Indexes

Performance and searchability are key features. Visually distinguish them:

- **The "Searchable" Toggle**: Do not use a generic checkbox. Use a Switch/Toggle component.
- **Impact Warning**: If the user enables "Full Text Search" or "Vector Index," render a small info-box (yellow/warning background) explaining the storage/performance implication.
- **Indexed Badge**: In the PropertyListItem, if a field is indexed, render a `SEARCH` badge in a muted accent color (e.g., `bg-blue-100 text-blue-800`).

## 5. Interaction States

- **Hover**: PropertyListItem should subtly darken/highlight on hover.
- **Active**: The currently selected property in the list must have a distinct left-border accent (e.g., `border-l-4 border-primary`).
- **Ghost/Dragging**: When reordering, the item being dragged should be semi-transparent; the drop target should show a blue horizontal line indicator.
- **Error**: If the "Machine Key" contains invalid characters (spaces, special chars), outline the input in Red and show a helper text below.

---

## Implementation Notes

### Technologies & Patterns

- **Layout**: Use Tailwind CSS utilities for the split-pane layout
- **Drag & Drop**: Consider `@dnd-kit/core` or `react-beautiful-dnd`
- **Icons**: Use Lucide React (`lucide-react`)
- **Forms**: Use controlled inputs with validation
- **State Management**: Local state for UI, GraphQL mutations for persistence

### File Structure

```
src/kraph/
  ├── components/
  │   ├── schema-builder/
  │   │   ├── TypeCard.tsx
  │   │   ├── PropertyList.tsx
  │   │   ├── PropertyListItem.tsx
  │   │   ├── PropertyInspector.tsx
  │   │   └── DataTypeSelector.tsx
  │   └── ...
  ├── pages/
  │   ├── SchemaEditorPage.tsx
  │   └── ...
  └── docs/
      └── schema-builder-design-guidelines.md (this file)
```

### Color Palette for Data Types

```tsx
const dataTypeColors = {
  string: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  number: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  boolean: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  date: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  relationship: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};
```

### Accessibility Considerations

- All interactive elements must be keyboard navigable
- Drag handles should have `aria-label="Reorder property"`
- Form inputs must have associated labels
- Color should not be the only indicator of state (use icons + color)
- Provide focus indicators for all interactive elements
