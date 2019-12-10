import { createServer, IncomingMessage } from 'http';
import { XMLHttpRequest } from '../src/XMLHttpRequest';
import getPort from 'get-port';

const headHasNoBody = (req: IncomingMessage) => req.method != 'HEAD';

test('events', async (done) => {
  // Track event calls
  let onreadystatechange = false;
  let readystatechange = false;
  let removed = true;
  const removedEvent = () => {
    removed = false;
  };

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    onreadystatechange = true;
  };

  xhr.addEventListener('readystatechange', () => {
    readystatechange = true;
  });

  // This isn't perfect, won't guarantee it was added in the first place
  xhr.addEventListener('readystatechange', removedEvent);
  xhr.removeEventListener('readystatechange', removedEvent);

  const port = await getPort();
  const server = createServer((req, res) => {
    const body = req.method !== 'HEAD' ? 'Hello World' : '';

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(body),
    });

    if (headHasNoBody(req)) {
      res.write(body);
    }
    res.end();

    expect(onreadystatechange).toEqual(true);
    expect(readystatechange).toEqual(true);
    expect(removed).toEqual(true);

    server.close();
    done();
  }).listen(port);

  xhr.open('GET', `http://localhost:${port}`);
  xhr.send(undefined);
});
