// @flow

import formatSnakeCaseToCapitalize from '../formatSnakeCaseToCapitalize';

describe('formatSnakeCaseToCapitalize to Capital Sentence', () => {
  it('Should format capital snake case', () => {
    expect(formatSnakeCaseToCapitalize('TERRITORY_MANAGER')).toEqual(
      'Territory Manager',
    );
    expect(formatSnakeCaseToCapitalize('territory_MANAGER')).toEqual(
      'Territory Manager',
    );
  });
});
