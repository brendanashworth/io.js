var common = require('../common');
var randomBytes = require('crypto').randomBytes;
var bench = common.createBenchmark(main, {
  n: [1e5],
  len: [32, 64, 128, 256, 1024]
});

function main(conf) {
  var len = conf.len | 0;
  var n = conf.n | 0;

  bench.start();

  for (var i = 0; i < n; i++) {
    randomBytes(len);
  }

  bench.end(n);
}
