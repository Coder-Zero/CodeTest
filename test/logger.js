//require('../logger');
const fs = require('fs'),
	  chalk = require('chalk'),
      yaml = require('js-yaml'),
      assert = require('assert'),
      {logger, LEVELS} = require('../logger');

var testLogger = new logger({root: 'test', path: 'test_logs'});

// Logger properties

// root
describe('Logger: root', function() {
	describe('root', function() {
		it('root should be set to test', function() {
			assert.equal('test', testLogger.root);
		})
	})
});

// flag
describe('Logger: flag', function() {
	describe('flag', function() {
		it('flag should be set to default', function() {
			assert.equal('default', testLogger.flag);
		})
	})
});

// path
describe('Logger: path', function() {
	describe('path', function() {
		it('path should be set to test_logs', function() {
			assert.equal('test_logs', testLogger.path);
		})
	})
});

// Logger functionality

// format()
describe('Logger: default format()', function() {
	describe('format()', function() {
		it('should take JS object and turn into JSON string', function() {
			var obj = {num: 23, name: 'Michael Jordan'};
			var jsonObj = JSON.parse(testLogger.format(obj));
			assert.equal('Michael Jordan', jsonObj.name);
		})
	})
});

describe('Logger: default format() negative test', function() {
	describe('format()', function() {
		it('should return false when false when a non JS object is passed in', function() {
			var nonJSObj = testLogger.format(12);
			assert(!nonJSObj);  // Returns with false as it should
		})
	})
});

// formatYAML()
describe('Logger: new formatYAML()', function() {
	describe('formatYAML()', function() {
		it('should take JS object and turn into YAML', function() {
			var obj = {num: 3, name: 'Dwayne Wade'};
			var yamlObj = testLogger.formatYAML(obj);
			console.log(yamlObj);
			var index = yamlObj.indexOf(obj.name);
			assert(index > -1);
		})
	})
});


describe('Logger: new formatYAML() negative test', function() {
	describe('formatYAML()', function() {
		it('should return false when false when a non JS object is passed in', function() {
			var nonJSObj2 = testLogger.formatYAML('Just a string');
			assert(!nonJSObj2);  // Returns with false as it should
		})
	})
});

// transport()
describe('Logger: default transport()', function() {
	describe('transport()', function() {
		it('should return color based on level and message logged', function() {
			var color = 'yellow';
			var msg = 'Testing warning message!';
			var result = testLogger.transport(LEVELS.WARN, msg);
			assert(color == result.color && msg == result.message);
		})
	})
});

describe('Logger: default transport() negative test', function() {
	describe('transport()', function() {
		it('should return green and a default message', function() {
			var color = 'green';
			var defaultMsg = 'No message.'
			var result = testLogger.transport(null, null);
			assert(color == result.color && defaultMsg == result.message);
		})
	})
});

// transportToFile()

// Making call here
var message = 'Testing simple message to file under test_logs folder.';
testLogger.transportToFile(LEVELS.DEBUG, message);

describe('Logger: new transportToFile()', function() {
	describe('transportToFile()', function() {
		it('should create/append to folder test_logs and add log file with name of level given(debug)', function(done) {
			fs.readFile('test_logs/debug.log', (err, data) => {
				if (err) throw err;

				var fileIndex = data.indexOf('test_logs');
				assert(fileIndex > -1);
				done();
			});
		})
	})
});

// Making call here
testLogger.transportToFile(null, null);

describe('Logger: new transportToFile() negative test', function() {
	describe('transportToFile()', function() {
		it('should create/append to folder test_logs and add log file with name of default which is info', function(done) {
			fs.readFile('test_logs/info.log', (err, data) => {
				if (err) throw err;

				var fileIndex = data.indexOf('No message');
				assert(fileIndex > -1);
				done();
			});
		})
	})
});