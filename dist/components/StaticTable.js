"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = _interopRequireDefault(require("react"));
var _tableToCsv = _interopRequireDefault(require("../src/table-to-csv"));
var _jsFileDownload = _interopRequireDefault(require("js-file-download"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * StaticTable per react
 * @param {object} columns - elenco delle colonne.
 * @author Massimo Cassandro
 */

// import classnames from 'classnames';

function StaticTable(props) {
  const tableRef = _react.default.useRef();

  // formattazioni std per i vari tipi di dati
  // la classe std viene sovrascitta se presente come parametro nella colonna
  const data_types = {
      // string: {}
      // element: {},
      date: {
        className: props.centerAlignClassName,
        render: d => new Date(d).toLocaleString('it-IT', {
          year: 'numeric',
          // '2-digit'
          month: '2-digit',
          // 'short'
          day: '2-digit' // 'numeric
        })
      },

      num: {
        className: props.rightAlignClassName,
        render: d => (d ? +d : 0).toLocaleString('it-IT', {
          maximumFractionDigits: 2
        })
      },
      perc: {
        className: props.rightAlignClassName,
        formatClassName: props.percClassName,
        render: d => (d ? +d : 0).toLocaleString('it-IT', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })
      },
      percDecimal: {
        className: props.rightAlignClassName,
        formatClassName: props.percClassName,
        render: d => ((d ? +d : 0) * 100).toLocaleString('it-IT', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })
      },
      euro: {
        className: props.rightAlignClassName,
        formatClassName: props.euroClassName,
        render: d => (d ? +d : 0).toLocaleString('it-IT', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
    },
    setClassName = function (col) {
      let addFormatClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (col.className) {
        return col.className;
      }
      if (col.dataType) {
        return [...(data_types[col.dataType]?.className ? [data_types[col.dataType]?.className] : []), ...(addFormatClass ? [data_types[col.dataType]?.formatClassName] : [])].join(' ');
      } else {
        return null;
      }
    };
  const TableHeadings = () => {
    return props.columns.map((col, idx) => {
      return /*#__PURE__*/_react.default.createElement("th", {
        className: setClassName(col, false),
        key: idx,
        scope: "col"
      }, col.title);
    });
  };
  const tableRows = data => {
    return data.map((row, idx) => {
      return /*#__PURE__*/_react.default.createElement("tr", {
        key: idx
      }, props.columns.map((col, i) => {
        let content,
          addFormatClass = true;
        if (col.parse && typeof col.parse === 'function') {
          content = col.parse(row);
        } else {
          content = row[col.key];
        }
        if (content === null) {
          content = '';
          addFormatClass = false;
        } else if (content === 0 && !props.showZero) {
          content = props.zeroValuesChar;
          addFormatClass = false;
        } else if (col.render && typeof col.render === 'function') {
          content = col.render(content);
        } else if (col.dataType && data_types[col.dataType]?.render) {
          content = data_types[col.dataType].render(content);
        }
        const isTh = col.rowHeading && i === 0,
          CellTag = isTh ? 'th' : 'td';
        return /*#__PURE__*/_react.default.createElement(CellTag, {
          scope: isTh ? 'row' : null,
          key: i,
          className: setClassName(col, addFormatClass)
        }, content);
      }));
    });
  };
  const setDownloadFilename = str => {
    str = str.replace(/(\.csv)$/, '').replace(/[/:]/g, '-').replace(/-+/g, '-').replace(/^-/, '').replace(/-$/, '');
    return str + ' [' + new Date().toISOString().split('T')[0] + '].csv';
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: props.wrapperClassName
  }, /*#__PURE__*/_react.default.createElement("table", {
    className: props.tableClassName,
    ref: tableRef
  }, props.caption && /*#__PURE__*/_react.default.createElement("caption", null, props.caption), /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement(TableHeadings, null))), /*#__PURE__*/_react.default.createElement("tbody", null, tableRows(props.data)), props.footerData && /*#__PURE__*/_react.default.createElement("tfoot", null, tableRows(props.footerData)))), props.showDownloadBtn && /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex"
  }, props.footerInfo && /*#__PURE__*/_react.default.createElement("div", null, props.footerInfo), /*#__PURE__*/_react.default.createElement("div", {
    className: `flex-grow-1 ${props.rightAlignClassName}`
  }, /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: props.downloadBtnClassName,
    onClick: () => {
      (0, _jsFileDownload.default)((0, _tableToCsv.default)(tableRef.current, props.zeroValuesChar), setDownloadFilename(props.downloadFilename));
    }
  }, props.downloadBtnLabel))));
}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

StaticTable.propTypes = {
  caption: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.element]),
  tableClassName: _propTypes.default.string,
  wrapperClassName: _propTypes.default.string,
  centerAlignClassName: _propTypes.default.string,
  rightAlignClassName: _propTypes.default.string,
  percClassName: _propTypes.default.string,
  euroClassName: _propTypes.default.string,
  showZero: _propTypes.default.bool,
  zeroValuesChar: _propTypes.default.string,
  columns: _propTypes.default.arrayOf(_propTypes.default.shape({
    title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.element, _propTypes.default.node]).isRequired,
    key: _propTypes.default.string,
    dataType: _propTypes.default.string,
    className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
    render: _propTypes.default.func,
    parse: _propTypes.default.func,
    rowHeading: _propTypes.default.bool
  })).isRequired,
  data: _propTypes.default.array.isRequired,
  footerData: _propTypes.default.array,
  showDownloadBtn: _propTypes.default.bool,
  downloadBtnLabel: _propTypes.default.string,
  downloadBtnClassName: _propTypes.default.string,
  downloadFilename: _propTypes.default.string,
  footerInfo: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.element])
};
StaticTable.defaultProps = {
  tableClassName: 'table',
  wrapperClassName: 'table-responsive',
  centerAlignClassName: 'text-center',
  rightAlignClassName: 'text-right',
  percClassName: 'perc',
  euroClassName: 'euro',
  showZero: false,
  zeroValuesChar: '\u2014',
  showDownloadBtn: false,
  downloadBtnLabel: 'Download',
  downloadBtnClassName: 'btn btn-outline-secondary btn-sm',
  downloadFilename: 'download.csv'
};
var _default = StaticTable;
exports.default = _default;