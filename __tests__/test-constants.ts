import { XMLHttpRequest } from '../lib/XMLHttpRequest';

test('constants', () => {
  const xhr = new XMLHttpRequest();
  expect(xhr.UNSENT).toEqual(0);
  expect(xhr.OPENED).toEqual(1);
  expect(xhr.HEADERS_RECEIVED).toEqual(2);
  expect(xhr.LOADING).toEqual(3);
  expect(xhr.DONE).toEqual(4);
});
