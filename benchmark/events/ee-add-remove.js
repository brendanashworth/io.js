var events = require('events');
var Benchmark = require('benchmark');

var listener = function() {};
var ee = new events.EventEmitter();

var suite = new Benchmark.Suite();
suite
  .add('one', function() {
    ee.on('dummy', listener);
    ee.removeListener('dummy', listener);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest: ' + this.filter('fastest').pluck('name'));
  })
  .run();
