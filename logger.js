const fs = require('fs'),
      yaml = require('js-yaml');

const LEVELS = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    DEBUG: 'debug'
};

// Flags will indicate what functionality of the logger the user wants
const FLAG = {
    DEFAULT: 'default',  // Message will be JSON and logged to console
    YAML: 'yaml',        // Message will be YAML and logged to console
    FILE: 'file',        // Message will be JSON and logged to a file
    BOTH: 'both'         // Message will be YAML and logged to a file
};

function logger(config) {
    this.root = config.root || 'root';
    this.flag = config.flag || 'default';  // Added to determine the functionality of Logger
    this.path = config.path || 'out';      // Added in case logs need to go in a different folder

    // Keeping the following in here so useLogger.js still functions
    if (config.format) {
        this.format = config.format;
    }

    if (config.transport) {
        this.transport = config.transport;
    }
}

logger.prototype = {

    log(data, level) {
        this.level = level;
        this.data = data;

        const logObj = this.createLogObject();

        // Calling existing or new functionality based on the flag set
        const message = this.flag == FLAG.DEFAULT || this.flag == FLAG.FILE ? this.format(logObj): this.formatYAML(logObj);

        if (this.flag == FLAG.DEFAULT || this.flag == FLAG.YAML) {
            this.transport(level, message);    
        }
        else {
            this.transportToFile(level, message);
        }
        
    },

    createLogObject() {
        let rootObj;

        if (this.root) {
            rootObj = { root: this.root };
        }

        const data = typeof this.data == 'string' ? { message: this.data } : this.data;

        const logObj = Object.assign(rootObj, data, { level: this.level || 'info'});

        return logObj;
    },

    format(logObj) {
        //Check if logObj is a proper JS object
        if (logObj !== null && typeof logObj === 'object') {
            return JSON.stringify(logObj);
        } 
        else {
            // For running test cases, just returning false, other option would be to log a general error
            return false;
            /*
            if (this.flag == FLAG.DEFAULT || this.flag == FLAG.YAML) {
                this.transport(LEVELS.ERROR, 'An error occurred in format(): Not a JS Object!');
            } else {
                this.transportToFile(LEVELS.ERROR, 'An error occurred in format(): Not a JS Object!');
            }
            */
        }
    },

    // Added as feature to format logs to YAML instead of JSON
    formatYAML(logObj) {
        //Check if logObj is a proper JS object
        if (logObj !== null && typeof logObj === 'object') {
            return yaml.safeDump(logObj);
        } 
        else {
            // For running test cases, just returning false, other option would be to log a general error
            return false;
            /*
            if (this.flag == FLAG.DEFAULT || this.flag == FLAG.YAML) {
                this.transport(LEVELS.ERROR, 'An error occurred in formatYAML(): Not a JS Object!');
            } else {
                this.transportToFile(LEVELS.ERROR, 'An error occurred in formatYAML(): Not a JS Object!');
            }
            */
        }
    },

    transport(level, message) {
        const chalk = require('chalk');
        var msg = message ? message : 'No message.';

        // Returning color and message logged for testing
        if (level == 'error') {
            console.log(chalk.red(msg));
            return {color: 'red', message: msg};
        }
        else if (level == 'warning') {
            console.log(chalk.yellow(msg));
            return {color: 'yellow', message: msg};
        }
        else if (level == 'debug') {
            console.log(chalk.blue(msg));
            return {color: 'blue', message: msg};
        }
        else {
            //the default is info
            console.log(chalk.green(msg));
            return {color: 'green', message: msg};
        }

    },

    // Added as feature to log to file
    transportToFile(level, message) {
        var lvl = level ? level : 'info';               // If null, default to 'info'
        var msg = message ? message : 'No message.';    // If null, default message to 'No message.'

        // If file path doesn't exist, it creates it, otherwise it appends
        if (!fs.existsSync(this.path)) {
             fs.mkdir(this.path);
             fs.appendFile(`${this.path}/${lvl}.log`, msg + '\n', (err) => {
                if (err) throw err;
            });
        } 
        else {
            fs.appendFile(`${this.path}/${lvl}.log`, msg + '\n', (err) => {
                if (err) throw err;
            });
        }
    }
}

module.exports = { logger, LEVELS, FLAG };
