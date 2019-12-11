import { XMLHttpRequest, SecurityErrDOMException } from '../src';
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

  it('should throw a security error if the method is forbidden', () => {
    expect(() => xhr.open('CONNECT', 'https://google.ca')).toThrowError(
      SecurityErrDOMException,
    );
    expect(() => xhr.open('connect', 'https://google.ca')).toThrowError(
      SecurityErrDOMException,
    );
    expect(() => xhr.open('TRACE', 'https://google.ca')).toThrowError(
      SecurityErrDOMException,
    );
    expect(() => xhr.open('trace', 'https://google.ca')).toThrowError(
      SecurityErrDOMException,
    );
    expect(() => xhr.open('TRACK', 'https://google.ca')).toThrowError(
      SecurityErrDOMException,
    );
    expect(() => xhr.open('track', 'https://google.ca')).toThrowError(
      SecurityErrDOMException,
    );
  });
});
