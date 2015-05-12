var url = require('url');
var v8 = require('v8');
var Benchmark = require('benchmark');

// Force-optimize url.parse() so that the benchmark doesn't get
// disrupted by the optimizer kicking in halfway through.
v8.setFlagsFromString('--allow_natives_syntax');
eval('%OptimizeFunctionOnNextCall(url.parse)');

var suite = new Benchmark.Suite();
suite
  .add('one', function() {
    url.parse('http://nodejs.org/docs/latest/api/url.html#url_url_format_urlobj');
  })
  .add('two', function() {
    url.parse('http://blog.nodejs.org/');
  })
  .add('three', function() {
    url.parse('https://encrypted.google.com/search?q=url&q=site:npmjs.org&hl=en');
  })
  .add('four', function() {
    url.parse('javascript:alert("node is awesome");');
  })
  .add('five', function() {
    url.parse('some.ran/dom/url.thing?oh=yes#whoo');
  })
  .add('six', function() {
    url.parse('https://user:pass@example.com/');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest: ' + this.filter('fastest').pluck('name'));
  })
  .run();
