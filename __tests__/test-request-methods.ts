import { XMLHttpRequest } from '../src';
import { createServer } from 'http';
import getPort from 'get-port';

test('request methods', async (done) => {
  const methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'];
  let curMethod = 0;

  const port = await getPort();
  const server = createServer((req, res) => {
    // Check request method and URL
    expect(methods[curMethod]).toEqual(req.method);
    expect('/' + methods[curMethod]).toEqual(req.url);

    const body = req.method != 'HEAD' ? 'Hello World' : '';

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(body),
    });
    // HEAD has no body
    if (req.method != 'HEAD') {
      res.write(body);
    }
    res.end();

    if (curMethod == methods.length - 1) {
      server.close();
      done();
    }
  }).listen(port);

  function start(method: string) {
    // Reset each time
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (method == 'HEAD') {
          expect('').toEqual(this.responseText);
        } else {
          expect('Hello World').toEqual(this.responseText);
        }

        curMethod++;

        if (curMethod < methods.length) {
          start(methods[curMethod]);
        }
      }
    };

    const url = `http://localhost:${port}/` + method;
    xhr.open(method, url);
    xhr.send(undefined);
  }

  start(methods[curMethod]);
});
