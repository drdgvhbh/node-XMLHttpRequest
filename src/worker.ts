/* eslint-disable @typescript-eslint/no-var-requires */
const request = require('request');

if (process.argv.length === 2) {
  console.error('missing arguments to request');
  process.exit(1);
}

const cb = function(err, response) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(JSON.stringify(response));
    process.exit(0);
  }
};

if (process.argv.length === 3) {
  request(process.argv[2], cb);
} else if (process.argv.length >= 4) {
  request(process.argv[2], JSON.parse(process.argv[3]), cb);
}
