import {RawInspector} from './bloks/inspector/Inspector';
import {lovekitBlokComponents} from './bloks/lovekit';
import {shadcnComposableComponents} from './bloks/primitives/Primitives';
import {standardBlokFunctions} from './functions';
import {createBlokCatalog} from './runtime';

/**
 * The catalog a blok payload is validated and rendered against: which
 * components exist, which functions a `utilCall` may name.
 *
 * The backend does not enumerate either — `ComponentNode.component` and
 * `UtilCall.operation` are free-form strings — so this module is the authority,
 * and `describeBlokCatalog` turns it into the published manifest.
 */
export const defaultBlokCatalog = createBlokCatalog(
  'https://arkitekt.live/catalogs/v1.json',
  [...shadcnComposableComponents, ...lovekitBlokComponents, RawInspector],
  standardBlokFunctions,
);
