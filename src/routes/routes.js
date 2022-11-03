// @flow
import type {Route} from './Route-type';

import Dashboard from '../scenes/DashboardScene';
import Cms from '../scenes/CMSScene';

let routes: Array<Route> = [
  {path: '/dashboard/:widget', SceneComponent: Dashboard},
  {path: '/cms', SceneComponent: Cms, needAuth: true},
];

export const INITIAL_ROUTE = '/dashboard/landingPageTerritory';

export default routes;
