import {createComponentImplementation} from '@a2ui/react/v0_9';

import {z} from 'zod';
import {CommonSchemas} from '@a2ui/web_core/v0_9';



export const MyProfile = createComponentImplementation({
  name: 'MyProfile',
  schema: z.object({
    username: CommonSchemas.DynamicString, // Can be literal "Alice" or {path: "/user/name"}
    bio: CommonSchemas.DynamicString,
    avatarUrl: CommonSchemas.DynamicString,
    onEdit: CommonSchemas.Action, // Resolves to a clickable () => void
    isEditable: CommonSchemas.DynamicBoolean,
    // Add 'checks' if you want validation support (standard in v0.9 interactive components)
    checks: CommonSchemas.Checkable.shape.checks,
  }),
}, ({props, buildChild}) => {
  // 'props' is strictly inferred from the Zod schema:
  // props.username is 'string' (resolved from DynamicString)
  // props.onEdit is '() => void' (resolved from Action)

  return (
    <div className="profile-widget">
      <img src={props.avatarUrl ?? ''} alt={props.username} />
      <h2>{props.username}</h2>
      <p>{props.bio}</p>

      {props.isEditable && (
        <button onClick={props.onEdit} disabled={props.isValid === false}>
          Edit Profile
        </button>
      )}fff

      {/* Render validation errors if any check fails */}
      {props.validationErrors?.map((err, i) => (
        <div key={i} className="error-hint" style={{color: 'red'}}>
          {err}
        </div>
      ))}
    </div>
  );
});
