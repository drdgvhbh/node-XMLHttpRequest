import { equal } from 'assert';
import { XMLHttpRequest } from '../src/XMLHttpRequest';

test('request-protocols', () => {
  let xhr;
  const url = 'file://' + __dirname + '/testdata.txt';

  const runSync = () => {
    xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        equal('Hello World', this.responseText);
      }
    };
    xhr.open('GET', url, false);
    xhr.send();
  };

  xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      equal('Hello World', this.responseText);
      runSync();
    }
  };

  // Async
  xhr.open('GET', url);
  xhr.send();

  // Sync
});
