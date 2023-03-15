"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setClassName;
var _columnsDataTypes = require("./columns-data-types");
// Restituisce la stringa delle classi per la colonna data

function setClassName(col) {
  let addFormatClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (col.className) {
    return col.className;
  }
  if (col.dataType) {
    return [...(_columnsDataTypes.data_types[col.dataType]?.className ? [_columnsDataTypes.data_types[col.dataType]?.className] : []), ...(addFormatClass ? [_columnsDataTypes.data_types[col.dataType]?.formatClassName] : [])].join(' ');
  } else {
    return null;
  }
}