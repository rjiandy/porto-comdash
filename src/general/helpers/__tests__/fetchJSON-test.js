// @flow

import {createFetchJSON} from '../fetchJSON';

function createHeaders(headerParams): Map<string, mixed> {
  return new Map(headerParams);
}

describe('FetchJSON Test', () => {
  it('Should return data', async () => {
    let mockResponse = {
      headers: createHeaders([['Content-Type', 'application/json; UTF=888']]),
      json: () => Promise.resolve({a: 1}),
      ok: true,
    };
    let mockFetch = jest.fn(() => mockResponse);
    let fetchJSON = createFetchJSON(mockFetch);
    let result = await fetchJSON('asd', {});
    expect(mockFetch.mock.calls).toEqual([['asd', {}]]);
    expect(result).toEqual({a: 1});
  });
  it('Should throw error if response status is not 200', async () => {
    let mockResponse = {
      headers: createHeaders([['Content-Type', 'application/json;']]),
      json: () => Promise.resolve({a: 1}),
      ok: false,
      status: 404,
    };
    let mockFetch = jest.fn(() => mockResponse);
    let fetchJSON = createFetchJSON(mockFetch);
    try {
      await fetchJSON('any', {});
    } catch (error) {
      expect(error.message).toBe('Unexpected response status: 404');
    }
  });
  it('Should throw error if response content type is not application/json', async () => {
    let mockResponse = {
      headers: createHeaders([['Content-Type', 'text/html;']]),
      json: () => Promise.resolve({a: 1}),
      ok: true,
      status: 200,
    };
    let mockFetch = jest.fn(() => mockResponse);
    let fetchJSON = createFetchJSON(mockFetch);
    try {
      await fetchJSON('any', {});
    } catch (error) {
      expect(error.message).toBe(
        `Unexpected response type: text/html, should've return application/json`
      );
    }
  });
});
