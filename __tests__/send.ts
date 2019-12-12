import { XMLHttpRequest, InvalidStateDOMException } from '../src';
import getport from 'get-port';
import { fork } from 'child_process';
describe('send', () => {
  it('should be synchronous is synchronous flag is set', async (done) => {
    const port = await getport();
    const serverUrl = `http://localhost:${port}`;

    const cp = fork(
      require.resolve('./dummy-server-worker'),
      [port.toString(), 'asdf'],
      {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      },
    );

    cp.on('message', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', serverUrl, false);
      xhr.send();

      expect(xhr.responseText).toEqual('asdf');
      done();
    });
  });

  it('should throw an "InvalidStateError", if state is not opened', () => {
    const xhr = new XMLHttpRequest();
    expect(() => xhr.send()).toThrowError(InvalidStateDOMException);
  });

  it('should throw an "InvalidStateError", if send flag is set', async (done) => {
    const port = await getport();
    const serverUrl = `http://localhost:${port}`;

    const cp = fork(
      require.resolve('./dummy-server-worker'),
      [port.toString(), 'asdf'],
      {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      },
    );

    cp.on('message', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', serverUrl);
      xhr.send();

      expect(() => xhr.send()).toThrowError(InvalidStateDOMException);
      done();
    });
  });
});
