import { XMLHttpRequest } from '../src/XMLHttpRequest';
import { createServer } from 'http';
import getPort from 'get-port';

test('redirect 303', async (done) => {
  const xhr = new XMLHttpRequest();
  const port = await getPort();
  const server = createServer((req, res) => {
    if (req.url === '/redirectingResource') {
      res.writeHead(303, { Location: `http://localhost:${port}/` });
      res.end();
      return;
    }

    const body = 'Hello World';
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(body),
      Date: 'Thu, 30 Aug 2012 18:17:53 GMT',
      Connection: 'close',
    });
    res.write('Hello World');
    res.end();

    server.close();
  }).listen(port);

  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      expect(xhr.getRequestHeader('Location')).toEqual('');
      expect(xhr.responseText).toEqual('Hello World');
      done();
    }
  };

  xhr.open('GET', `http://localhost:${port}/redirectingResource`);
  xhr.send(undefined);
});
