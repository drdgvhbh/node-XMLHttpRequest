import { XMLHttpRequest } from '../src';
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
});
