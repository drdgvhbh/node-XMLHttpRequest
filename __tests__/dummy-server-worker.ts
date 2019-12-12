/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require('http');

const port = process.argv[2];
const body = process.argv[3];

const server = createServer((_req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(body),
    Connection: 'close',
  });

  res.write(body);
  res.end();
  server.close();
}).listen(+port);

server.on('listening', () => {
  if (process.send) {
    process.send('ready');
  }
});
