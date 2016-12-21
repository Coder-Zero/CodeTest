const fs = require('fs'),
      yaml = require('js-yaml'),
      {logger, LEVELS, FLAG} = require('./logger');

let rootLogger = new logger({ root: 'driver' });

rootLogger.log({ message: 'starting the app' });

rootLogger.log('an error occured', LEVELS.ERROR);

rootLogger.flag = FLAG.BOTH;
rootLogger.log('Testing existing functionality with new.', LEVELS.WARN);

//transport is an overridable method that outputs the log.  By default it just logs to the console.
//In this instance it is being used to write to a file based on the current level being logged.
var folder = 'out';
const fileLogger = new logger({
    transport(level, message) {
        fs.appendFile(folder + `/${level}.log`, message + '\n', (err) => {
            if (err) throw err;
        });
    }
});

fileLogger.log({cwd:__dirname}, LEVELS.DEBUG);

//format is an overridable function that takes an object and returns a string that will get written.
//By default it jsonifies the passed in object.  In this case it outputs yaml string.
const yamlLogger = new logger({
    format(logObj) {
        return yaml.safeDump(logObj);
    }
});

yamlLogger.log('This is some yaml');
//yamlLogger.flag = 'file';
//yamlLogger.log('This is a test.');



