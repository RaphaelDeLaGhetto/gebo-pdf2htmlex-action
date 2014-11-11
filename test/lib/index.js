'use strict';

var doc = require('../../lib'),
    fse = require('fs-extra');

/**
 * convert
 */
exports.convert = {

    setUp: function(callback) {
        fse.createReadStream('./test/docs/pdf.pdf').pipe(fse.createWriteStream('/tmp/pdf.pdf'));
        fse.createReadStream('./test/docs/pdf.pdf').pipe(fse.createWriteStream('/tmp/My Inconveniently named PDF.pdf'));
        callback();
    },

    tearDown: function(callback) {
        fse.unlinkSync('/tmp/pdf.pdf');
        fse.unlinkSync('/tmp/My Inconveniently named PDF.pdf');
        fse.removeSync('/tmp/gebo-pdf2htmlEx');
        callback();
    },

    /**
     * Timeout stuff
     */
    'Write the pdf2htmlEX PID to a file in the output directory': function(test) {
        test.expect(1);
        doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html', function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            try {
              fse.openSync('/tmp/my.html.pid', 'r');
              test.ok(true);
            }
            catch(err) {
              test.ok(false, err);
            }
            test.done();
          });
    },

    // How do I test this?
//    'Kill the pdf2htmlEX process if it executes longer than allowed': function(test) {
//        test.expect(2);
//        doc.convert('./test/docs/pdf.pdf', function(err, path) {
//            if (err) {
//              test.ok(false, err);
//            }
//            try {
//              fse.openSync('/tmp/pdf.html.pid', 'r');         
//              test.ok(true);
//              fse.openSync(path, 'r');         
//              test.ok(false, 'The file at the returned path shouldn\'t exist');
//            }
//            catch(err) {
//              test.ok(true);
//            }
//            test.done();
//          });
//    },

    'Convert a PDF to HTML': function(test) {
        test.expect(2);
        doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html', function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            test.equal(path, '/tmp/gebo-pdf2htmlEX/my.html');
            try {
              fse.closeSync(fse.openSync(path, 'r'));
              test.ok(true);
            }
            catch (err) {
              test.ok(false, err);
            }
            test.done();
          });
    },

    'Convert a PDF with spaces in the filename to HTML': function(test) {
        test.expect(2);
        doc.convert('/tmp/My Inconveniently named PDF.pdf', '/tmp/gebo-pdf2htmlEX', 'My Inconveniently named PDF.html',function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            test.equal(path, '/tmp/gebo-pdf2htmlEX/My Inconveniently named PDF.html');
            try {
              fse.closeSync(fse.openSync(path, 'r'));
              test.ok(true);
            }
            catch (err) {
              test.ok(false, err);
            }
            test.done();
          });
    },
};

