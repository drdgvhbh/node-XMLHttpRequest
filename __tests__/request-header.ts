import { XMLHttpRequest, InvalidStateDOMException } from '../src';
import { createServer } from 'http';
import getPort from 'get-port';

describe('request header', () => {
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

  describe('set', () => {
    it('should throw an invalid state err if state is not opened', () => {
      const xhr = new XMLHttpRequest();
      expect(() =>
        xhr.setRequestHeader('Content-Type', 'application/json'),
      ).toThrowError(InvalidStateDOMException);
    });

    it('should not throw an error if header name is forbidden', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://google.ca');
      for (const header of forbiddenHeaders) {
        expect(() => xhr.setRequestHeader(header, 'asdf')).not.toThrowError();
      }
    });

    it('should not set the header if header name is forbidden', async (done) => {
      const port = await getPort();
      const server = createServer((req, res) => {
        for (const header of forbiddenHeaders) {
          expect(req.headers[header]).toEqual(undefined);
        }
        const body = '';
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(body),
          Connection: 'close',
        });
        res.write(body);
        res.end();

        server.close();
      }).listen(port);
      for (const header of forbiddenHeaders) {
        await new Promise((res) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', `http://localhost:${port}/`);
          xhr.setRequestHeader(header, 'fdsa');
          xhr.send();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === xhr.DONE) {
              res();
            }
          };
        });
      }

      done();
    });
  });
});
