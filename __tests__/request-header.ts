import { XMLHttpRequest, InvalidStateDOMException } from '../src';
import nock from 'nock';

describe('request header', () => {
  let xhr: XMLHttpRequest;

  const forbiddenHeaders: ReadonlyArray<string> = [
    `Accept-Charset`,
    `Accept-Encoding`,
    `Access-Control-Request-Headers`,
    `Access-Control-Request-Method`,
    `Connection`,
    `Content-Length`,
    `Cookie`,
    `Cookie2`,
    `Date`,
    `DNT`,
    `Expect`,
    `Host`,
    `Keep-Alive`,
    `Origin`,
    `Referer`,
    `TE`,
    `Trailer`,
    `Transfer-Encoding`,
    `Upgrade`,
    `Via`,
  ];

  beforeEach(async () => {
    xhr = new XMLHttpRequest();
  });

  describe('set', () => {
    it('should throw an invalid state err if state is not opened', () => {
      expect(() =>
        xhr.setRequestHeader('Content-Type', 'application/json'),
      ).toThrowError(InvalidStateDOMException);
    });

    it('should not throw an error if header name is forbidden', () => {
      xhr.open('GET', 'https://google.ca');
      for (const header of forbiddenHeaders) {
        expect(() => xhr.setRequestHeader(header, 'asdf')).not.toThrowError();
      }
    });

    it('should not set the header if header name is forbidden', async (done) => {
      const serverURL = 'https://derping.ca';
      for (const header of forbiddenHeaders) {
        nock(serverURL)
          .get('/')
          .reply(function(_uri, _rb, cb) {
            expect(this.req.headers[header]).toEqual(undefined);
            cb(null, [200, 'fdsa']);
          });
        await new Promise((res) => {
          xhr.open('GET', serverURL);
          xhr.setRequestHeader(header, 'asdf');
          xhr.send();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === xhr.DONE) {
              // TODO: if this worked properly shouldn't need to abort
              xhr.abort();
              res();
            }
          };
        });
      }

      done();
    });
  });
});
