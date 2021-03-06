var doc = require('../lib'),
    exec = require('child_process').exec,
    fs = require('fs-extra'),
    nconf = require('nconf'),
    q = require('q'),
    utils = require('gebo-utils'),
    winston = require('winston');

module.exports = function() {

    // Logging stuff           
    nconf.file({ file: './gebo.json' });
    var logLevel = nconf.get('logLevel'),
        logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({ colorize: true }) ] });

    // For producing the download URL
    var domain = nconf.get('domain');

    /**
     * Convert the given PDF to HTML
     * 
     * @param object 
     * @param object 
     * 
     * @return promise 
     */
    exports.convert = function(verified, message) {
        var deferred = q.defer();
    
        if (verified.admin || verified.execute) {
          var destDir = './public/' + message.file.path.split('/').pop();

          // Respect the original file name
          var filename = utils.getOutputFileName(message.file.originalname, 'html');

          doc.convert(message.file.path, destDir, filename, message.content, function(err, path) {
                if (err) {
                  if (logLevel === 'trace') logger.error('gebo-pdf2htmlEX:', err);
                  deferred.resolve({ error: err });
                }
                else {
                  if (message.content && message.content.raw) {
                    fs.realpath(destDir, function(err, resolvedPath) {
                        deferred.resolve({ filePath: resolvedPath + '/' + filename, fileName: filename });
                      });
                  }
                  else {
                    deferred.resolve(domain + '/' + message.file.path.split('/').pop() + '/' + filename);
                  }
                }
            });
        }
        else {
          deferred.reject('You are not permitted to request or propose that action');
        }
        return deferred.promise;
      };

    return exports;
};

