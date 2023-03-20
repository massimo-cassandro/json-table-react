"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _react = _interopRequireWildcard(require("react"));
var _JsonTableModule = _interopRequireDefault(require("./styles/JsonTable.module.scss"));
var _jsUtilities = require("@massimo-cassandro/js-utilities");
var _buildPageArray = _interopRequireWildcard(require("../src/build-page-array"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function JsonTable(props) {
  // const Div = styled.div``;
  const [url, setUrl] = (0, _react.useState)(null),
    container = (0, _react.useRef)(),
    [jsonData, updateJsonData] = (0, _react.useState)(null),
    [table, updateTable] = (0, _react.useState)(null),
    [defaultContent, updateDefaultContent] = (0, _react.useState)(null),
    [currentPage, setCurrentPage] = (0, _react.useState)(1),
    [searchStr, setSearchStr] = (0, _react.useState)(null),
    [orderArray, setOrderArray] = (0, _react.useState)(props.order ?? null),
    [loadingOffsetTop, setLoadingOffsetTop] = (0, _react.useState)(null),
    // offset top elemento loading
    [tableInfo, updateTableInfo] = (0, _react.useState)(null),
    navBarId = (0, _jsUtilities.unique_id)(),
    column_url_params = (() => {
      let p = [];
      props.columns.forEach((item, idx) => {
        // per compatibilità con jquery datatable
        if (item.name && !item.data) {
          item.data = item.name;
        }
        p.push(
        // [`columns[${idx}][data]`, item.data],
        [`columns[${idx}][name]`, item.data], [`columns[${idx}][searchable]`, item.searchable !== undefined ? item.searchable.toString() : 'true'], [`columns[${idx}][orderable]`, item.orderable !== undefined ? item.searchable.toString() : 'true']
        // [`columns[${idx}][search][value]`, ''],
        // [`columns[${idx}][search][regex]`, 'false']
        );
      });

      return p.map(item => `${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`);
    })();

  // =>> composizione url
  function updateUrl() {
    let pag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    let searchString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : searchStr;
    let currentOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : orderArray;
    const start = (pag - 1) * props.pageRows;
    let url_params = [...column_url_params, 'draw=1', `start=${start}`, `length=${props.pageRows}`, `search[value]=${encodeURIComponent(searchString ?? '')}`
    // `_=${Date.now()}`
    ];

    if (currentOrder) {
      currentOrder.forEach((item, idx) => {
        url_params.push(`order[${idx}][column]=${item[0]}`, `order[${idx}][dir]=${item[1].toLowerCase()}`);
      });
      setOrderArray(currentOrder);
    }
    setCurrentPage(pag);
    if (searchString !== null) {
      setSearchStr(searchString);
    }
    setUrl(props.ajaxUrl + '?' + (props.urlExtraQueryString ? `${props.urlExtraQueryString}&` : '') + url_params.join('&'));
  }

  // init
  (0, _react.useEffect)(() => {
    updateUrl();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =>> loading json
  (0, _react.useEffect)(() => {
    const setDefaultContent = (contentType, offsetTop) => {
      updateDefaultContent(contentType && /*#__PURE__*/_react.default.createElement("div", {
        className: _JsonTableModule.default.msgWrapper,
        style: {
          paddingTop: offsetTop ? `${offsetTop - 10}px` : null
        }
      }, props.defaultContents[contentType]));
    };
    const getJsonData = async url => {
      const response = await fetch(url);
      if (!response.ok) {
        /* eslint-disable */
        console.error('Ajax error on: ' + url);
        console.error(response);
        /* eslint-enable */
        return false;
      }
      const data = await response.json(response);
      return data;
    };
    container?.current?.classList.add(_JsonTableModule.default.loading);
    container?.current?.querySelector('.json-table-search').blur();
    setDefaultContent('loading', loadingOffsetTop);
    updateTableInfo('In caricamento...');
    if (url) {
      getJsonData(url).then(jsondata => {
        updateJsonData(jsondata);
        setLoadingOffsetTop(null);
        if (jsondata.data.length) {
          setDefaultContent(null);
        } else {
          setDefaultContent('nodata');
        }
        container?.current?.classList.remove(_JsonTableModule.default.loading);
      }).catch(err => {
        console.error(err); // eslint-disable-line
        setDefaultContent('error');
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, props.defaultContents]);

  // =>> costruzione tabella e paginazione
  (0, _react.useEffect)(() => {
    // restituisce true se la colonna data va visualizzata
    const columnIsVisible = col => {
      return col.title !== undefined && (col.includeIf === undefined || col.includeIf === true) && (col.visible !== undefined || col.visible !== false);
    };
    const TableHeadings = () => {
      const SortArrows = () => {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: _JsonTableModule.default.sortArrows
        }, /*#__PURE__*/_react.default.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 16 8",
          className: _JsonTableModule.default.arrowUp
        }, /*#__PURE__*/_react.default.createElement("path", {
          d: "M0 0L16 0 7.959 8z"
        })), /*#__PURE__*/_react.default.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 16 8",
          className: _JsonTableModule.default.arrowDn
        }, /*#__PURE__*/_react.default.createElement("path", {
          d: "M0 0L16 0 7.959 8z"
        })));
      };
      return props.columns.map((col, idx) => {
        // necessario effettuare il ciclo anche sugli elementi nascosti, perché
        // l'indice deve considerarli
        if (columnIsVisible(col)) {
          // props.order => [[column_idx, direction (asc|desc)],...]
          // es.r => order={[[1,'desc'], [7, 'asc']]}
          let order_classes = orderArray.filter(item => item[0] === idx).map(item => `${_JsonTableModule.default[`order${item[1].charAt(0).toUpperCase() + item[1].substr(1).toLowerCase()}`]}`);
          let isOrderable = false;
          if (col.orderable === undefined || col.orderable) {
            order_classes.push(_JsonTableModule.default.order);
            isOrderable = true;
          }
          return /*#__PURE__*/_react.default.createElement("th", _extends({
            className: (0, _classnames.default)(col.className, order_classes),
            key: idx,
            scope: "col"
          }, isOrderable && {
            onClick: () => {
              let prevOrder = orderArray.filter(item => item[0] === idx)[0] ?? [];
              updateUrl(1, searchStr, [[idx, prevOrder[1] === 'asc' ? 'desc' : 'asc']]);
            }
          }), /*#__PURE__*/_react.default.createElement("div", null, col.title, isOrderable && /*#__PURE__*/_react.default.createElement(SortArrows, null)));
        } else {
          return '';
        }
      });
    };
    const TableRows = () => {
      return jsonData.data.map((row, idx) => {
        return /*#__PURE__*/_react.default.createElement("tr", {
          key: idx
        }, props.columns.filter(col => {
          return columnIsVisible(col);
        }).map((col, i) => {
          let cell_content;

          // =>> generazione tabella: tipo dati
          if (col.render !== undefined && typeof col.render === 'function') {
            cell_content = col.render(row);
          } else if (col.type === 'sf_date') {
            cell_content = /*#__PURE__*/_react.default.createElement("span", {
              className: "text-nowrap"
            }, new Date(row[col.data].date).toLocaleString('it-IT', {
              year: '2-digit',
              month: 'short',
              day: 'numeric'
            }));
          } else if (col.type === 'euro') {
            let val = +row[col.data];
            if (val) {
              cell_content = /*#__PURE__*/_react.default.createElement("span", {
                className: "euro"
              }, val.toLocaleString('it-IT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }));
            } else {
              cell_content = '–';
            }
          } else {
            cell_content = row[col.data];
          }
          return /*#__PURE__*/_react.default.createElement("td", {
            key: i,
            className: (0, _classnames.default)(col.className)
          }, cell_content);
        }));
      });
    };
    const Pagination = () => {
      if (jsonData?.recordsFiltered) {
        const page_array = (0, _buildPageArray.default)(currentPage, props.pageRows, jsonData.recordsFiltered);
        return /*#__PURE__*/_react.default.createElement("nav", {
          id: navBarId,
          "aria-label": "Navigazione pagine",
          className: _JsonTableModule.default.paginationNav
        }, /*#__PURE__*/_react.default.createElement("ul", null, page_array.map((pag, i) => {
          let content;
          if (pag === currentPage) {
            content = /*#__PURE__*/_react.default.createElement("span", {
              className: _JsonTableModule.default.selected
            }, pag);
          } else if (pag !== null) {
            content = /*#__PURE__*/_react.default.createElement("button", {
              type: "button",
              title: `Vai a pagina ${pag}`,
              onClick: e => {
                setLoadingOffsetTop(e.target.offsetTop);
                updateUrl(pag);
              }
            }, pag);
          } else {
            content = /*#__PURE__*/_react.default.createElement("span", null, "\u2026");
          }
          return /*#__PURE__*/_react.default.createElement("li", {
            key: i
          }, content);
        })));
      } else {
        return null;
      }
    };
    if (jsonData?.recordsFiltered) {
      updateTable( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("table", {
        className: props.tableClassName
      }, props.caption && /*#__PURE__*/_react.default.createElement("caption", null, props.caption), /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement(TableHeadings, null))), /*#__PURE__*/_react.default.createElement("tbody", null, /*#__PURE__*/_react.default.createElement(TableRows, null))), /*#__PURE__*/_react.default.createElement(Pagination, null)));

      // =>> Update table info
      updateTableInfo( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, (+jsonData.recordsFiltered).toLocaleString('it-IT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }), " record trovati", jsonData.recordsFiltered < jsonData.recordsTotal ? ` (su un totale di ${(+jsonData.recordsTotal).toLocaleString('it-IT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })})` : '', /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("a", {
        href: `#${navBarId}`,
        title: "Vai alla navigazione delle pagine",
        onClick: e => {
          e.preventDefault();
          container?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'end'
          });
        }
      }, "Pagina ", /*#__PURE__*/_react.default.createElement("strong", null, currentPage), " di ", /*#__PURE__*/_react.default.createElement("strong", null, (0, _buildPageArray.calcTotPages)(jsonData.recordsFiltered, props.pageRows)))));
    } else {
      updateTable(null);
      updateTableInfo( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Nessun record trovato"));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonData, orderArray]);
  (0, _react.useEffect)(() => {
    container?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }, [table]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: _JsonTableModule.default.mainWrapper,
    ref: container
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _JsonTableModule.default.info
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _JsonTableModule.default.resultInfo
  }, tableInfo), /*#__PURE__*/_react.default.createElement("div", {
    className: _JsonTableModule.default.search
  }, /*#__PURE__*/_react.default.createElement("input", {
    title: "Filtra records",
    className: "form-control form-control-sm json-table-search",
    type: "search",
    placeholder: "INVIO per eseguire la ricerca",
    "aria-label": "Filtra risultati",
    defaultValue: searchStr,
    onKeyDown: e => {
      if (e.code === 'Enter') {
        updateUrl(1, e.target.value);
      }
    },
    onInput: e => {
      // per il pulsante di reset
      if (e.target.value === '') {
        updateUrl(1, '');
      }
    }
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: _JsonTableModule.default.content
  }, table, defaultContent)));
}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

JsonTable.propTypes = {
  caption: _propTypes.default.string,
  tableClassName: _propTypes.default.string,
  ajaxUrl: _propTypes.default.string,
  urlExtraQueryString: _propTypes.default.string,
  order: _propTypes.default.array,
  columns: _propTypes.default.array,
  pageRows: _propTypes.default.number,
  iconaErrore: _propTypes.default.element,
  iconaInfo: _propTypes.default.element,
  defaultContents: _propTypes.default.exact({
    loading: _propTypes.default.element,
    error: _propTypes.default.element,
    nodata: _propTypes.default.element
  })
};
JsonTable.defaultProps = {
  tableClassName: 'table',
  pageRows: 25,
  order: [],
  iconaErrore: null,
  iconaInfo: null,
  get defaultContents() {
    return {
      loading: /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('spinner-border', 'text-primary', _JsonTableModule.default.msg),
        role: "status"
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "visually-hidden"
      }, "Loading...")),
      error: /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('text-danger', _JsonTableModule.default.msg)
      }, this.iconaErrore, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("p", {
        className: "fw-bold"
      }, "Errore nel caricamento dei dati"), /*#__PURE__*/_react.default.createElement("p", {
        className: "xsmall"
      }, "Riprova, e se l'errore si ripete contatta l'assistenza tecnica"))),
      nodata: /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('text-info', _JsonTableModule.default.msg)
      }, this.iconaInfo, /*#__PURE__*/_react.default.createElement("div", {
        className: "fw-bold"
      }, "Nessun dato disponibile"))
    };
  }
};
var _default = JsonTable;
exports.default = _default;