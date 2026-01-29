# Schema Builder - React Hook Form Implementation

## Overview
The Schema Builder now uses React Hook Form for comprehensive form state management and validation. All schema changes are validated before being sent to the backend.

## Key Features

### 1. React Hook Form Integration
- **Form State**: Managed by `useForm` hook with `mode: "onChange"` for real-time validation
- **Field Array**: Properties managed with `useFieldArray` for dynamic add/remove/reorder
- **Validation**: Runs on every change and before submission

### 2. Validation Rules

#### Property-Level Validation
Located in `utils.ts` - `propertyValidation` object:

**Label Validation:**
- Required field
- Min length: 1 character
- Max length: 100 characters

**Key Validation:**
- Required field
- Must start with a letter
- Only lowercase letters, numbers, and underscores
- Min length: 1 character
- Max length: 64 characters
- Validated with regex: `/^[a-z][a-z0-9_]*$/`

**Description Validation:**
- Optional field
- Max length: 500 characters

#### Schema-Level Validation
Located in `utils.ts` - `validateSchema()` function:

1. **Duplicate Key Detection**: No two properties can have the same key
2. **Valid Key Format**: All keys must match the regex pattern
3. **Missing Labels**: All properties must have non-empty labels
4. **Conflicting Flags**: Properties cannot be both required and optional

### 3. Error Display

#### PropertyInspector Component
- Shows validation errors next to each field
- Red border on invalid fields
- Asterisk (*) on labels with errors
- Error summary alert at the top when errors exist

#### Form Submission
- Comprehensive validation before save
- Toast notifications with:
  - List of all validation errors
  - Specific details about what's wrong
  - Duration: 5 seconds for errors

### 4. Migration Support
When schema changes are detected (additions, renames, removals):
- Migration dialog shows affected entity count
- Default values can be set for new properties
- All migrations are validated before execution

## Usage Flow

1. **Load Schema**: Initial properties loaded into form via `defaultValues`
2. **Edit Properties**: All changes tracked by React Hook Form
3. **Real-time Validation**: Errors shown immediately on change
4. **Add/Remove/Reorder**: Uses `useFieldArray` methods (append, remove, move)
5. **Submit**:
   - `handleSubmit` wrapper calls `onSubmit`
   - Schema validation runs (`validateSchema`)
   - If valid: saves to backend
   - If invalid: shows error toast with details

## Technical Implementation

### Form Structure
```typescript
interface SchemaFormData {
  properties: PropertyDefinition[];
}
```

### Key Hooks Used
- `useForm<SchemaFormData>`: Main form management
- `useFieldArray`: Dynamic property list management
- `formState.errors`: Access to validation errors
- `getValues`: Get current form values
- `setValue`: Update specific fields with validation

### Validation Trigger Points
1. **onChange**: As user types in fields
2. **onSubmit**: Before saving to backend
3. **Manual**: When using `setValue` with `shouldValidate: true`

## Files Modified

1. **SchemaBuilderPage.tsx**
   - Integrated React Hook Form
   - Uses `getValues()` to avoid React Compiler warnings
   - Passes errors to PropertyInspector

2. **PropertyInspector.tsx**
   - Accepts `errors` prop
   - Displays field-level validation errors
   - Shows error summary alert

3. **utils.ts**
   - Added `propertyValidation` rules
   - Added `validateSchema()` function
   - Comprehensive cross-field validation

4. **EntityCategorySchemaBuilderPage.tsx**
   - Integrates migration detection
   - Validates before triggering migration

## Benefits

✅ **Type-safe**: Full TypeScript support with React Hook Form
✅ **Real-time feedback**: Errors shown immediately
✅ **No invalid saves**: Backend only receives validated data
✅ **Better UX**: Clear error messages guide users
✅ **Prevents conflicts**: Duplicate keys caught before save
✅ **Clean code**: Declarative validation rules
✅ **Performance**: Only re-renders when needed
