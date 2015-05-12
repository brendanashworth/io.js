var EventEmitter = require('events').EventEmitter;
var Benchmark = require('benchmark');

var ee = new EventEmitter();
for (var i = 0; i < 10; i++)
  ee.on('dummy', function() {});

var suite = new Benchmark.Suite();
suite
  .add('basic', function() {
    var r = EventEmitter.listenerCount(ee, 'dummy');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest: ' + this.filter('fastest').pluck('name'));
  })
  .run();
