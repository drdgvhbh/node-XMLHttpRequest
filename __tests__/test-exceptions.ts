import { XMLHttpRequest } from '../src/XMLHttpRequest';
import getPort from 'get-port';

const forbiddenRequestHeaders = [
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'content-transfer-encoding',
  'cookie',
  'cookie2',
  'date',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
];

test('exceptions', async (done) => {
  const port = await getPort();
  const serverUrl = `http://localhost:${port}/`;

  const xhr = new XMLHttpRequest();

  expect(() => xhr.open('TRACK', serverUrl)).toThrowError();
  expect(() => xhr.open('TRACE', serverUrl)).toThrowError();
  expect(() => xhr.open('CONNECT', serverUrl)).toThrowError();

  expect(() => xhr.open('GET', serverUrl)).not.toThrowError();

  for (const header of forbiddenRequestHeaders) {
    expect(() => xhr.setRequestHeader(header, 'Test')).toThrowError();
  }

  expect(() => xhr.setRequestHeader('X-Foobar', 'Test')).not.toThrowError();
  done();
});
