import getPort from 'get-port';
import { createServer } from 'http';
import { XMLHttpRequest } from '../src';

describe('abort', () => {
  it('should abort the request', async (done) => {
    const port = await getPort();

    let count = 0;
    const server = createServer((_, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      const i = setInterval(() => {
        if (!res.connection.destroyed) {
          res.write('asdf');
          count += 1;
        } else {
          clearInterval(i);
        }
      }, 150);
    }).listen(port);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:${port}/`);
    xhr.send();

    setTimeout(() => {
      xhr.abort();
      setTimeout(() => {
        expect(count).toEqual(3);
        server.close();
        done();
      }, 250);
    }, 550);
  });
});
