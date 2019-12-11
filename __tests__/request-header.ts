import { XMLHttpRequest, InvalidStateDOMException } from '../src';

describe('request header', () => {
  let xhr: XMLHttpRequest;

  beforeEach(async () => {
    xhr = new XMLHttpRequest();
  });

  describe('set', () => {
    it('should throw an invalid state err if state is not opened', () => {
      expect(() =>
        xhr.setRequestHeader('Content-Type', 'application/json'),
      ).toThrowError(InvalidStateDOMException);
    });
  });
});
