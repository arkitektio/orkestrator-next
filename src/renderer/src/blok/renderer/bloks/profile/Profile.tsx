import {
  BlokPropSchemas,
  createBlokComponent,
  useAction,
  useBlok,
  useValidation,
  useValue,
} from '../../runtime';
import * as z from 'zod';



export const MyProfile = createBlokComponent({
  name: 'MyProfile',
  schema: z.object({
    username: BlokPropSchemas.DynamicString,
    bio: BlokPropSchemas.DynamicString,
    avatarUrl: BlokPropSchemas.DynamicString,
    onEdit: BlokPropSchemas.Action,
    isEditable: BlokPropSchemas.DynamicBoolean,
    checks: BlokPropSchemas.Checkable.shape.checks,
  }),
}, ({component, schema}) => {
  const blok = useBlok(component, schema);
  const validation = useValidation(component, schema);
  const username = useValue(blok.username);
  const bio = useValue(blok.bio);
  const avatarUrl = useValue(blok.avatarUrl);
  const onEdit = useAction(blok.onEdit);
  const isEditable = useValue(blok.isEditable);

  return (
    <div className="profile-widget">
      <img src={avatarUrl ?? ''} alt={username} />
      <h2>{username}</h2>
      <p>{bio}</p>

      {isEditable && (
        <button onClick={onEdit} disabled={validation.isValid === false}>
          Edit Profile
        </button>
      )}

      {validation.validationErrors.map((err, i) => (
        <div key={i} className="error-hint" style={{color: 'red'}}>
          {err}
        </div>
      ))}
    </div>
  );
});
