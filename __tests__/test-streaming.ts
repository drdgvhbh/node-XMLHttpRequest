import { createServer } from 'http';
import { XMLHttpRequest } from '../lib/XMLHttpRequest';
import getPort from 'get-port';

test('streaming', async (done) => {
  const port = await getPort();
  const xhr = new XMLHttpRequest();

  let onreadystatechange = false;
  let readystatechange = false;
  let removed = true;
  let loadCount = 0;

  function completeResponse(res, server, body) {
    res.end();
    expect(onreadystatechange).toEqual(true);
    expect(readystatechange).toEqual(true);
    expect(removed).toEqual(true);
    expect(loadCount).toEqual(body.length);
    server.close();
    done();
  }

  const server = createServer(function(req, res) {
    const body = req.method != 'HEAD' ? ['Hello', 'World', 'Stream'] : [];

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(body.join('')),
    });

    let nextPiece = 0;
    const interval = setInterval(() => {
      if (nextPiece < body.length) {
        res.write(body[nextPiece]);
        nextPiece++;
      } else {
        completeResponse(res, server, body);
        clearInterval(interval);
      }
    }, 100); //nagle may put writes together, if it happens rise the interval time
  }).listen(port);

  // Track event calls

  const removedEvent = function() {
    removed = false;
  };

  xhr.onreadystatechange = function() {
    onreadystatechange = true;
  };

  xhr.addEventListener('readystatechange', function() {
    readystatechange = true;
    if (xhr.readyState == xhr.LOADING) {
      loadCount++;
    }
  });

  // This isn't perfect, won't guarantee it was added in the first place
  xhr.addEventListener('readystatechange', removedEvent);
  xhr.removeEventListener('readystatechange', removedEvent);

  xhr.open('GET', `http://localhost:${port}`);
  xhr.send(undefined);
});
