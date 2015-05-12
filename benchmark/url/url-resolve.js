var url = require('url');
var v8 = require('v8');
var Benchmark = require('benchmark');

// Force-optimize url.resolve() so that the benchmark doesn't get
// disrupted by the optimizer kicking in halfway through.
v8.setFlagsFromString('--allow_natives_syntax');
eval('%OptimizeFunctionOnNextCall(url.resolve)');

var suite = new Benchmark.Suite();
suite
  .add('one', function() {
    url.resolve('http://example.com/', '../../../../../etc/passwd');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest: ' + this.filter('fastest').pluck('name'));
  })
  .run();
