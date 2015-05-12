var EventEmitter = require('events').EventEmitter;
var Benchmark = require('benchmark');

var ee = new EventEmitter();
for (var i = 0; i < 10; i++)
  ee.on('dummy', function() {});

var suite = new Benchmark.Suite();
suite
  .add('0 args', function() {
    ee.emit('dummy');
  })
  .add('1 args', function() {
    ee.emit('dummy', 5);
  })
  .add('2 args', function() {
    ee.emit('dummy', 5, true);
  })
  .add('3 args', function() {
    ee.emit('dummy', 5, true, 'hi');
  })
  .add('4 args', function() {
    ee.emit('dummy', 5, true, 'hi', 0xBD);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest: ' + this.filter('fastest').pluck('name'));
  })
  .run();
