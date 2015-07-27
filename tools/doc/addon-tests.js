// This script generates the tests in test/addons from the code blocks in
// doc/addons.markdown.

var fs = require('fs');
var path = require('path');
var marked = require('marked');

var doc = path.resolve(__dirname, '..', '..', 'doc', 'api', 'addons.markdown');
var verifyDir = path.resolve(__dirname, '..', '..', 'test', 'addons');

var contents = fs.readFileSync(doc).toString();

var tokens = marked.lexer(contents, {});
var files = null;
var id = 0;

// Just to make sure that all examples will be processed
tokens.push({ type: 'heading' });

for (var i = 0; i < tokens.length; i++) {
  var token = tokens[i];

  // When we encounter a heading, flush files
  if (token.type === 'heading') {
    if (files && Object.keys(files).length !== 0) {
      writeFiles(files, function(err) {
        if (err)
          throw err;
      });
    }
    files = {};
  // When we encounter a code block, add to files
  } else if (token.type === 'code') {
    var match = token.text.match(/^\/\/\s+(.*\.(?:cc|h|js))[\r\n]/);
    if (match === null)
      continue;
    files[match[1]] = token.text;
  }
}

function writeFiles(files, callback) {
  var dir = path.resolve(verifyDir, 'doc-' + id++);

  console.log('generating', path.relative(process.cwd(), dir));

  files = Object.keys(files).map(function(name) {
    return {
      path: path.resolve(dir, name),
      name: name,
      content: files[name]
    };
  });
  files.push({
    path: path.resolve(dir, 'binding.gyp'),
    content: JSON.stringify({
      targets: [
        {
          target_name: 'addon',
          sources: files.map(function(file) {
            return file.name;
          })
        }
      ]
    })
  });

  fs.mkdir(dir, function() {
    // Ignore errors

    for (var i = 0; i < files.length; i++)
      fs.writeFile(files[i].path, files[i].content, callback);
  });
}
