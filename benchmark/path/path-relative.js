var common = require('../common');
var relative = require('path').relative;

var bench = common.createBenchmark(main, {
  n: [1e6]
});

function main(conf) {
  var n = conf.n | 0;

  bench.start();

  for (var i = 0; i < n; i++) {
    relative('/var/lib', '/var/apache');
    relative('/var/lib', '/bin');
    relative('/', '/var/lib');
    relative('/home/users/brendan', '../directory/index.html');
    relative('/boot/system/x32/iojs', '../../system/x32/iojs');
  }

  bench.end(n);
}
