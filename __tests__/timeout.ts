import { XMLHttpRequest } from '../src';

/**
 * https://xhr.spec.whatwg.org/#dom-xmlhttprequest-timeout
 */
describe('timeout', () => {
  let xhr: XMLHttpRequest;

  beforeEach(async () => {
    xhr = new XMLHttpRequest();
  });

  it('should be initialized to 0', () => {
    expect(xhr.timeout).toEqual(0);
  });

  test('should be able to set timeout', () => {
    xhr.timeout = 5000;
    expect(xhr.timeout).toEqual(5000);
  });
});
