'use strict';

const common = require('../common.js');

const path = require('path');
const fs = require('fs');
const net = require('net');

var bench = common.createBenchmark(main, {
  encoding: ['buffer', 'ascii', 'utf8'],
  dur: [5],
  size: [2, 1024, 1024 * 1024]
});

function main(conf) {
  var dur = +conf.dur;
  var size = +conf.size;
  var encoding = conf.encoding;

  if (encoding == 'buffer')
    var chunk = (new Buffer(size)).fill('b');
  else if (encoding == 'ascii')
    var chunk = new Array(size + 1).join('a');
  else if (encoding == 'utf8')
    var chunk = new Array(size/2 + 1).join('ü');
  else
    throw new TypeError('bad encoding');

  var server = net.createServer();

  server.listen(common.PORT, function() {
    var conn = net.connect(common.PORT, function() {
      bench.start();
      conn.on('drain', write);
      write();
    });

    function write() {
      while (conn.write(chunk, encoding) !== false);
    }
  });

  var received = 0;
  server.on('connection', function(conn) {
    conn.on('data', function(chunk) {
      received += chunk.length;
    });
  });

  setTimeout(done, dur * 1000);
  function done() {
    var mbits = (received * 8) / (1024 * 1024);
    bench.end(mbits);
    conn.destroy();
    server.close();
  }
}
