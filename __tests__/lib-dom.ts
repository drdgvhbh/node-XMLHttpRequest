import { XMLHttpRequest as NodeXMLHttpRequest } from '../src';

test('conforms to lib dom XMLHttpRequest spec', () => {
  const xhr: XMLHttpRequest = new NodeXMLHttpRequest();
  expect(xhr).toBeTruthy();
});
