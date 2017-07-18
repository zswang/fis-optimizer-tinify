var assert = require('should');
var fistinify = require('../');
var fs = require('fs');
var path = require('path');

describe('fixtures', function() {
  var key = process.env.TINIFY_KEY;
  this.timeout(35000);
  it('compress:cache', function() {
    var input = path.join(__dirname, 'png/source.png');
    var buffer = fs.readFileSync(input);
    var output = fistinify(buffer, {
      filename: input,
      dirname: path.dirname(input),
      ext: path.extname(input)
    }, {
      key: key,
      cacheDir: path.join(__dirname, 'png/cache')
    });
    assert.ok(output.length / buffer.length < 0.8);
  });

  it('compress:nocache', function() {
    var input = path.join(__dirname, 'png/source.png');
    var buffer = fs.readFileSync(input);
    var output = fistinify(buffer, {
      filename: input,
      dirname: path.dirname(input),
      ext: path.extname(input)
    }, {
      key: key
    });
    assert.ok(output.length / buffer.length < 0.8);
  });
});