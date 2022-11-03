// @flow

type SubTypecCategory = 'Premium' | 'Medium' | 'Low' | 'Super Low';
type SubTypecs = Array<SubTypecCategory>;

type FlavorCategory = 'SKT' | 'SKM High TAR' | 'SKM Low TAR' | 'White';
type Flavors = Array<FlavorCategory>;

export const SUB_TYPEC: SubTypecs = ['Premium', 'Medium', 'Low', 'Super Low'];
export const FLAVOR: Flavors = ['SKT', 'SKM High TAR', 'SKM Low TAR', 'White'];
