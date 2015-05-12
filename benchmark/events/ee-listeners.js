var EventEmitter = require('events').EventEmitter;
var Benchmark = require('benchmark');

// 10 listeners
var ee1 = new EventEmitter();
for (var i = 0; i < 10; i++)
  ee1.on('dummy', function() {});

// 100 listeners
var ee2 = new EventEmitter();
ee2.setMaxListeners(101);
for (var k = 0; k < 100; k++)
  ee2.on('dummy', function() {});

// 1000 listeners
var ee3 = new EventEmitter();
ee3.setMaxListeners(1001);
for (var j = 0; j < 1000; j++)
  ee3.on('dummy', function() {});

var suite = new Benchmark.Suite();
suite
  .add('10 listeners', function() {
    var r = ee1.listeners('dummy');
  })
  .add('100 listeners', function() {
    var r = ee2.listeners('dummy');
  })
  .add('1000 listeners', function() {
    var r = ee3.listeners('dummy');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest: ' + this.filter('fastest').pluck('name'));
  })
  .run();
