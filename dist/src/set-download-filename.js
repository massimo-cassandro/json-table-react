"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setDownloadFilename;
var _defaults = require("./defaults");
function setDownloadFilename(str) {
  let format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'excel';
  const ext = format.toLowerCase() === 'excel' ? 'xlsx' : 'csv';
  if (str) {
    str = str.replace(/(\.csv)$/, '').replace(/(\.xslx?)$/, '').replace(/[/:]/g, '-').replace(/-+/g, '-').replace(/^-/, '').replace(/-$/, '');
    return str + ' [' + new Date().toISOString().split('T')[0] + `].${ext}`;
  }
  return _defaults.defaults.downloadFilename;
}