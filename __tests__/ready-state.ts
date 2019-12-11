import { XMLHttpRequest } from '../src';

describe('ready state', () => {
  let xhr: XMLHttpRequest;

  beforeEach(async () => {
    xhr = new XMLHttpRequest();
  });

  it('should be initialized to unset', () => {
    expect(xhr.readyState).toEqual(xhr.UNSENT);
  });
});
