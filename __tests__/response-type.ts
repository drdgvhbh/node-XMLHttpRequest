import { XMLHttpRequest } from '../src';
import getport from 'get-port';
import nock from 'nock';

/**
 * https://xhr.spec.whatwg.org/#the-responsetype-attribute
 */
describe('response-type', () => {
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
        setTimeout(() => cb(null, [200, 'dsadsad']), 250);
      });
  });

  it('should be initialized to an empty string', () => {
    expect(xhr.responseType).toEqual('');
  });

  it('should succeed when setting the response type as document', () => {
    expect(() => (xhr.responseType = 'document')).not.toThrow();
  });

  it('should not change the response type as document', () => {
    xhr.responseType = 'document';

    expect(xhr.responseType).not.toEqual('document');
  });

  it('should throw an "InvalidStateError" DOMException if state is done', async (done) => {
    xhr.open('GET', `http://localhost:${serverUrl}`);
    xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        expect(() => (xhr.responseType = 'json')).toThrow();
        expect(() => (xhr.responseType = 'arraybuffer')).toThrow();
        expect(() => (xhr.responseType = 'blob')).toThrow();
        expect(() => (xhr.responseType = 'text')).toThrow();
        done();
      }
    };
  });

  it('should throw an "InvalidStateError" DOMException if state is loading', async (done) => {
    xhr.open('GET', `http://localhost:${port}`, true);
    xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.LOADING) {
        expect(() => (xhr.responseType = 'json')).toThrow();
        expect(() => (xhr.responseType = 'arraybuffer')).toThrow();
        expect(() => (xhr.responseType = 'blob')).toThrow();
        expect(() => (xhr.responseType = 'text')).toThrow();

        done();
      }
    };
  });
});
