"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.data_types = void 0;
var _defaults = require("./defaults");
// formattazioni std per i vari tipi di dati
// la classe std viene sovrascritta se presente come parametro nella colonna

const data_types = {
  // string: {} // default type
  date: {
    className: _defaults.defaults.rightAlignClassName,
    render: d => new Date(d).toLocaleString('it-IT', {
      year: 'numeric',
      // '2-digit'
      month: '2-digit',
      // 'short'
      day: '2-digit' // 'numeric
    })
  },

  // symfony date field
  sfDate: {
    className: _defaults.defaults.rightAlignClassName,
    render: d => new Date(d.date).toLocaleString('it-IT', {
      year: 'numeric',
      // '2-digit'
      month: '2-digit',
      // 'short'
      day: '2-digit' // 'numeric
    })
  },

  datetime: {
    className: _defaults.defaults.rightAlignClassName,
    render: d => {
      const date = new Date(d);
      return date.toLocaleString('it-IT', {
        year: 'numeric',
        // '2-digit'
        month: '2-digit',
        // 'short'
        day: '2-digit' // 'numeric
      }) + '\u00A0' + '<small>' + date.toLocaleString('it-IT', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }) + '</small>';
    }
  },
  num: {
    className: _defaults.defaults.rightAlignClassName,
    render: d => (d ? +d : 0).toLocaleString('it-IT', {
      maximumFractionDigits: 2
    })
  },
  perc: {
    className: _defaults.defaults.rightAlignClassName,
    formatClassName: _defaults.defaults.percClassName,
    render: d => (d ? +d : 0).toLocaleString('it-IT', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
  },
  percDecimal: {
    className: _defaults.defaults.rightAlignClassName,
    formatClassName: _defaults.defaults.percClassName,
    render: d => ((d ? +d : 0) * 100).toLocaleString('it-IT', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
  },
  euro: {
    className: _defaults.defaults.rightAlignClassName,
    formatClassName: _defaults.defaults.euroClassName,
    render: d => (d ? +d : 0).toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
};
exports.data_types = data_types;