import { XMLHttpRequest } from '../src';
describe('response-type', () => {
  let xhr: XMLHttpRequest;

  beforeEach(() => {
    xhr = new XMLHttpRequest();
  });

  it('should be initialized to an empty string', () => {
    expect(xhr.responseType).toEqual('');
  });

  it('should succeed when setting the response type as document', () => {
    expect(() => (xhr.responseType = 'document')).not.toThrow();
});
});
