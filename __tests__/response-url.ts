import nock from 'nock';
import getport from 'get-port';
import { XMLHttpRequest } from '../src';

/**
 * https://xhr.spec.whatwg.org/#dom-xmlhttprequest-responseurl
 */
describe('response-url', () => {
  let xhr: XMLHttpRequest;
  let port: number;
  let serverUrl: string;

  beforeEach(async () => {
    xhr = new XMLHttpRequest();
    port = await getport();
    serverUrl = `http://localhost:${port}`;

    nock(serverUrl)
      .get('/')
      .reply((_uri, _requestBody, cb) => {
        setTimeout(() => cb(null, [200, 'asdf']), 250);
      });
  });

  /**
   * Developers Note: It looks like it will always be an empty string
   *
   * @see https://github.com/nodejs/node/blob/master/lib/_http_incoming.js#L73
   */
  it('should be an empty string if response url is null', async (done) => {
    xhr.open('GET', `${serverUrl}/`);
    xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        expect(xhr.responseURL).toEqual('');
        done();
      }
    };
  });
});
