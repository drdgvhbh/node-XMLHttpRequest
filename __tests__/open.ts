import { XMLHttpRequest } from '../src';
import { SyntaxErrDOMException } from '../src';

describe('open', () => {
  let xhr: XMLHttpRequest;

  beforeEach(async () => {
    xhr = new XMLHttpRequest();
  });

  it('should throw a syntax error if the method does not exist', () => {
    expect(() => xhr.open('ASDF', 'https://google.ca')).toThrowError(
      SyntaxErrDOMException,
    );
  });
});
