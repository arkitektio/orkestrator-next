import {createBlokComponent, BlokSchemas} from '../../runtime';
import * as z from 'zod';



export const MyProfile = createBlokComponent({
  name: 'MyProfile',
  schema: z.object({
    username: BlokSchemas.DynamicString,
    bio: BlokSchemas.DynamicString,
    avatarUrl: BlokSchemas.DynamicString,
    onEdit: BlokSchemas.Action,
    isEditable: BlokSchemas.DynamicBoolean,
    checks: BlokSchemas.Checkable.shape.checks,
  }),
}, ({props}) => {
  return (
    <div className="profile-widget">
      <img src={props.avatarUrl ?? ''} alt={props.username} />
      <h2>{props.username}</h2>
      <p>{props.bio}</p>

      {props.isEditable && (
        <button onClick={props.onEdit} disabled={props.isValid === false}>
          Edit Profile
        </button>
      )}

      {props.validationErrors?.map((err, i) => (
        <div key={i} className="error-hint" style={{color: 'red'}}>
          {err}
        </div>
      ))}
    </div>
  );
});
