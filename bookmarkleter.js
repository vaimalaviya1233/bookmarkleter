'use strict';

// Load dependencies.
var uglify = require('uglify-js');

// URI-encode only a subset of characters. Most user agents are permissive with
// non-reserved characters, so don't obfuscate more than we have to.
var specialCharacters = ['%', '"', '<', '>', '#', '@', ' ', '\\&', '\\?'];

// CDN URL for jQuery.
var jQueryURL = '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.js';

// Create a bookmarklet.
var bookmarkleter = function (code, options) {

  options = options || {};

  // Set Uglify options.
  var uglifyOptions = {
    fromString: true,
    mangle: options.mangleVars
  };

  // Add jQuery, if requested.
  if (options.jQuery) {
    code = 'var __hasjq = function () {' + code + '};' +
    'if (window.jQuery) __hasjq();' +
    'var s = document.createElement("script");' +
    's.src = "' + jQueryURL + '";' +
    's.onload = __hasjq;' +
    'document.body.appendChild(s);';
  }

  // Add anonymous function wrapper, if requested.
  if (options.anonymize) {
    code = '(function(){' + code + '})()';
  }

  // Parse and uglify code.
  var minifiedCode = uglify.minify(code, uglifyOptions).code;

  // If code uglifies down to nothing, stop processing.
  if (!minifiedCode) return;

  // URI-encode special characters.
  specialCharacters.forEach(function (char) {
    var charRegex = new RegExp(char, 'g');
    minifiedCode = minifiedCode.replace(charRegex, encodeURIComponent(char.replace(/\\/g, '')));
  });

  // Add javascript prefix.
  minifiedCode = 'javascript:' + minifiedCode;

  // Return bookmarklet.
  return minifiedCode;

};

module.exports = bookmarkleter;
